// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IUsageSettlement
/// @notice Interface for handling signed usage settlements
interface IUsageSettlement {
    /// @notice Events
    event UsageSettled(uint256 indexed subscriptionId, address indexed provider, uint256 usageAmount, uint256 nonce);

    /// @notice Errors
    error InvalidSignature();
    error NonceAlreadyUsed();
    error ExpiredDeadline();
    error ExceedsAllocatedCredits();

    /// @notice Settles usage based on a signed report from the provider
    function settleUsage(
        uint256 subscriptionId,
        uint256 usageAmount,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external;

    /// @notice Checks if a settlement nonce has been used
    function isNonceUsed(address provider, uint256 nonce) external view returns (bool);
}
