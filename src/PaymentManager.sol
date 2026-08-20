// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPaymentManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title PaymentManager
/// @notice Handles value transfer and fee calculation
contract PaymentManager is IPaymentManager, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant SECURITY_ADMIN_ROLE = keccak256("SECURITY_ADMIN_ROLE");

    uint256 private _protocolFeeBps;
    uint256 public constant MAX_FEE_BPS = 1000; // 10%

    // provider => token => balance
    mapping(address => mapping(address => uint256)) private _providerBalances;
    // token => accumulated protocol fees
    mapping(address => uint256) private _protocolFees;

    constructor(uint256 initialFeeBps) {
        if (initialFeeBps > MAX_FEE_BPS) revert InvalidFeeConfiguration();
        _protocolFeeBps = initialFeeBps;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Set the protocol fee in basis points (10000 = 100%)
    function setProtocolFeeBps(uint256 newFeeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newFeeBps > MAX_FEE_BPS) revert InvalidFeeConfiguration();
        _protocolFeeBps = newFeeBps;
        emit ProtocolFeeUpdated(newFeeBps);
    }

    /// @notice Gets the protocol fee configuration
    function getProtocolFeeBps() external view override returns (uint256) {
        return _protocolFeeBps;
    }

    /// @notice Gets the accumulated balance for a provider
    function getProviderBalance(address provider, address token) external view override returns (uint256) {
        return _providerBalances[provider][token];
    }
    
    /// @notice Gets the accumulated protocol fees for a token
    function getProtocolFeeBalance(address token) external view returns (uint256) {
        return _protocolFees[token];
    }

    /// @notice Processes payment for a subscription
    function processPayment(
        address payer,
        address provider,
        address token,
        uint256 amount,
        uint256 subscriptionId
    ) external payable override {
        // Assume caller is SubscriptionManager, so we might want to restrict access to only SubscriptionManager later.
        // For now, anyone can process a payment into the protocol.

        uint256 protocolFee = (amount * _protocolFeeBps) / 10000;
        uint256 providerShare = amount - protocolFee;

        if (token == address(0)) {
            if (msg.value != amount) revert InvalidPaymentAmount();
        } else {
            if (msg.value != 0) revert InvalidPaymentAmount();
            IERC20(token).safeTransferFrom(payer, address(this), amount);
        }

        _providerBalances[provider][token] += providerShare;
        _protocolFees[token] += protocolFee;

        emit PaymentReceived(subscriptionId, payer, token, amount, protocolFee);
    }

    /// @notice Withdraws accumulated funds for a provider
    function withdraw(address token) external override {
        uint256 amount = _providerBalances[msg.sender][token];
        if (amount == 0) revert InsufficientBalance();

        _providerBalances[msg.sender][token] = 0;

        if (token == address(0)) {
            (bool success, ) = msg.sender.call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(token).safeTransfer(msg.sender, amount);
        }

        emit Withdrawal(msg.sender, token, amount);
    }

    /// @notice Withdraws accumulated protocol fees
    function withdrawProtocolFees(address token, address to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 amount = _protocolFees[token];
        if (amount == 0) revert InsufficientBalance();

        _protocolFees[token] = 0;

        if (token == address(0)) {
            (bool success, ) = to.call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(token).safeTransfer(to, amount);
        }

        emit ProtocolFeesWithdrawn(token, amount);
    }
}
