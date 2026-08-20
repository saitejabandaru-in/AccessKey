// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IPaymentManager
/// @notice Interface for handling payments and protocol fees
interface IPaymentManager {
    /// @notice Events
    event PaymentReceived(uint256 indexed subscriptionId, address indexed payer, address indexed token, uint256 amount, uint256 protocolFee);
    event Withdrawal(address indexed provider, address indexed token, uint256 amount);
    event ProtocolFeeUpdated(uint256 newFeeBps);
    event ProtocolFeesWithdrawn(address indexed token, uint256 amount);

    /// @notice Errors
    error InvalidPaymentAmount();
    error TransferFailed();
    error InvalidFeeConfiguration();
    error InsufficientBalance();

    /// @notice Processes a payment for a subscription
    function processPayment(
        address payer,
        address provider,
        address token,
        uint256 amount,
        uint256 subscriptionId
    ) external payable;

    /// @notice Withdraws accumulated funds for a provider
    function withdraw(address token) external;

    /// @notice Gets the accumulated balance for a provider
    function getProviderBalance(address provider, address token) external view returns (uint256);

    /// @notice Gets the protocol fee configuration in basis points
    function getProtocolFeeBps() external view returns (uint256);
}
