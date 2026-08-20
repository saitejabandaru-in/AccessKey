// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUsageSettlement {
    event UsageSettled(uint256 indexed subscriptionId, uint256 consumedCredits);
    
    error InvalidSignature();
    error ExpiredDeadline();
    error ExceedsAllocatedCredits();
    error InvalidSubscription();
    error InvalidUsageAmount();

    function settleUsage(
        uint256 subscriptionId,
        uint256 consumedCredits,
        uint256 deadline,
        bytes calldata signature
    ) external;

    function getConsumedCredits(uint256 subscriptionId) external view returns (uint256);
}
