// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IPaymentManager
/// @notice Interface for handling streaming payments, escrow, and protocol fees
interface IPaymentManager {
    struct Stream {
        address provider;
        address subscriber;
        address token;
        uint256 providerAmount; // amount assigned to provider (after protocol fee)
        uint256 withdrawnAmount; // amount already withdrawn by provider
        uint256 startTime;
        uint256 duration;
    }

    /// @notice Events
    event PaymentStreamCreated(
        uint256 indexed subscriptionId,
        address indexed payer,
        address indexed token,
        uint256 amount,
        uint256 protocolFee
    );
    event Withdrawal(uint256 indexed subscriptionId, address indexed provider, address indexed token, uint256 amount);
    event RefundIssued(
        uint256 indexed subscriptionId, address indexed subscriber, address indexed token, uint256 amount
    );
    event ProtocolFeeUpdated(uint256 newFeeBps);
    event ProtocolFeesWithdrawn(address indexed token, uint256 amount);

    /// @notice Errors
    error InvalidPaymentAmount();
    error TransferFailed();
    error InvalidFeeConfiguration();
    error InsufficientBalance();
    error Unauthorized();
    error StreamDoesNotExist();
    error InvalidStreamConfiguration();

    /// @notice Processes a payment and locks it in a stream
    function processPayment(
        address payer,
        address provider,
        address token,
        uint256 amount,
        uint256 duration,
        uint256 subscriptionId
    ) external payable returns (uint256 actualAmount);

    /// @notice Provider withdraws unlocked funds from a specific stream
    function withdrawFromStream(uint256 subscriptionId) external;

    /// @notice Calculates unearned (locked) funds for a stream
    function getUnearnedFunds(uint256 subscriptionId) external view returns (uint256);

    /// @notice Calculates earned (unlocked but unwithdrawn) funds for a stream
    function getEarnedFunds(uint256 subscriptionId) external view returns (uint256);

    /// @notice Refunds unearned funds to the subscriber and closes the stream
    function cancelAndRefundStream(uint256 subscriptionId) external returns (uint256 refundedAmount);

    /// @notice Gets the protocol fee configuration in basis points
    function getProtocolFeeBps() external view returns (uint256);
}
