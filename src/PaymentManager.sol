// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPaymentManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title PaymentManager
/// @notice Handles streaming value transfer, escrow, and fee-on-transfer tokens
contract PaymentManager is IPaymentManager, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant SUBSCRIPTION_MANAGER_ROLE = keccak256("SUBSCRIPTION_MANAGER_ROLE");

    uint256 private _protocolFeeBps;
    uint256 public constant MAX_FEE_BPS = 1000; // 10%

    // token => accumulated protocol fees
    mapping(address => uint256) private _protocolFees;

    // subscriptionId => Stream
    mapping(uint256 => Stream) private _streams;

    constructor(uint256 initialFeeBps) {
        if (initialFeeBps > MAX_FEE_BPS) revert InvalidFeeConfiguration();
        _protocolFeeBps = initialFeeBps;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setProtocolFeeBps(uint256 newFeeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newFeeBps > MAX_FEE_BPS) revert InvalidFeeConfiguration();
        _protocolFeeBps = newFeeBps;
        emit ProtocolFeeUpdated(newFeeBps);
    }

    function getProtocolFeeBps() external view override returns (uint256) {
        return _protocolFeeBps;
    }

    function getProtocolFeeBalance(address token) external view returns (uint256) {
        return _protocolFees[token];
    }

    /// @notice Processes payment for a subscription (handles fee-on-transfer)
    function processPayment(
        address payer,
        address provider,
        address token,
        uint256 amount,
        uint256 duration,
        uint256 subscriptionId,
        address keeper,
        uint256 keeperReward
    ) external payable override onlyRole(SUBSCRIPTION_MANAGER_ROLE) returns (uint256 actualAmount) {
        if (duration == 0) revert InvalidStreamConfiguration();

        if (token == address(0)) {
            if (msg.value != amount) revert InvalidPaymentAmount();
            actualAmount = amount;
        } else {
            if (msg.value != 0) revert InvalidPaymentAmount();
            uint256 balanceBefore = IERC20(token).balanceOf(address(this));
            IERC20(token).safeTransferFrom(payer, address(this), amount);
            actualAmount = IERC20(token).balanceOf(address(this)) - balanceBefore;
        }

        if (keeperReward > actualAmount) revert InvalidPaymentAmount();

        uint256 feeBase = actualAmount - keeperReward;
        uint256 protocolFee = (feeBase * _protocolFeeBps) / 10000;
        uint256 providerShare = feeBase - protocolFee;

        _protocolFees[token] += protocolFee;

        if (keeperReward > 0 && keeper != address(0)) {
            if (token == address(0)) {
                (bool success, ) = keeper.call{value: keeperReward}("");
                if (!success) revert TransferFailed();
            } else {
                IERC20(token).safeTransfer(keeper, keeperReward);
            }
        }

        _streams[subscriptionId] = Stream({
            provider: provider,
            subscriber: payer,
            token: token,
            providerAmount: providerShare,
            withdrawnAmount: 0,
            startTime: block.timestamp,
            duration: duration
        });

        emit PaymentStreamCreated(subscriptionId, payer, token, actualAmount, protocolFee);
    }

    function _getEarnedFunds(Stream memory stream) internal view returns (uint256) {
        if (block.timestamp >= stream.startTime + stream.duration) {
            return stream.providerAmount - stream.withdrawnAmount;
        }
        uint256 elapsed = block.timestamp - stream.startTime;
        uint256 earned = (stream.providerAmount * elapsed) / stream.duration;
        return earned - stream.withdrawnAmount;
    }

    function getEarnedFunds(uint256 subscriptionId) external view override returns (uint256) {
        Stream memory stream = _streams[subscriptionId];
        if (stream.providerAmount == 0) return 0;
        return _getEarnedFunds(stream);
    }

    function getUnearnedFunds(uint256 subscriptionId) external view override returns (uint256) {
        Stream memory stream = _streams[subscriptionId];
        if (stream.providerAmount == 0) return 0;

        if (block.timestamp >= stream.startTime + stream.duration) {
            return 0;
        }
        uint256 elapsed = block.timestamp - stream.startTime;
        uint256 earned = (stream.providerAmount * elapsed) / stream.duration;
        return stream.providerAmount - earned;
    }

    /// @notice Provider withdraws unlocked funds from a stream
    function withdrawFromStream(uint256 subscriptionId) external override {
        Stream storage stream = _streams[subscriptionId];
        if (stream.provider != msg.sender) revert Unauthorized();

        uint256 earned = _getEarnedFunds(stream);
        if (earned == 0) revert InsufficientBalance();

        stream.withdrawnAmount += earned;

        if (stream.token == address(0)) {
            (bool success,) = msg.sender.call{value: earned}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(stream.token).safeTransfer(msg.sender, earned);
        }

        emit Withdrawal(subscriptionId, msg.sender, stream.token, earned);
    }

    /// @notice Refunds unearned funds to subscriber and zeroes stream
    function cancelAndRefundStream(uint256 subscriptionId)
        external
        override
        onlyRole(SUBSCRIPTION_MANAGER_ROLE)
        returns (uint256 refundedAmount)
    {
        Stream storage stream = _streams[subscriptionId];
        if (stream.providerAmount == 0) revert StreamDoesNotExist();

        if (block.timestamp >= stream.startTime + stream.duration) {
            return 0; // nothing to refund
        }

        uint256 elapsed = block.timestamp - stream.startTime;
        uint256 earned = (stream.providerAmount * elapsed) / stream.duration;
        refundedAmount = stream.providerAmount - earned;

        // The earned but unwithdrawn portion goes to provider instantly, or provider can still withdraw it.
        // We set duration to 0 and providerAmount to earned to effectively end the stream.
        stream.providerAmount = earned;
        stream.duration = 0; // Locks it out

        if (refundedAmount > 0) {
            if (stream.token == address(0)) {
                (bool success,) = stream.subscriber.call{value: refundedAmount}("");
                if (!success) revert TransferFailed();
            } else {
                IERC20(stream.token).safeTransfer(stream.subscriber, refundedAmount);
            }
            emit RefundIssued(subscriptionId, stream.subscriber, stream.token, refundedAmount);
        }
    }

    function withdrawProtocolFees(address token, address to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 amount = _protocolFees[token];
        if (amount == 0) revert InsufficientBalance();

        _protocolFees[token] = 0;

        if (token == address(0)) {
            (bool success,) = to.call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(token).safeTransfer(to, amount);
        }

        emit ProtocolFeesWithdrawn(token, amount);
    }
}
