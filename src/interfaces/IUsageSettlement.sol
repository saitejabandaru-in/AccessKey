// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUsageSettlement {
    event UsageSettled(uint256 indexed subscriptionId, uint256 consumedCredits);
    event SessionKeyAuthorized(address indexed subscriber, address indexed sessionKey);
    
    error InvalidSignature();
    error ExpiredDeadline();
    error ExceedsAllocatedCredits();
    error InvalidSubscription();
    error InvalidUsageAmount();
    error ArrayLengthMismatch();

    function authorizeSessionKey(address sessionKey) external;
    
    function settleUsage(
        uint256 subscriptionId,
        uint256 consumedCredits,
        uint256 deadline,
        bytes calldata signature
    ) external;

    function batchSettleUsage(
        uint256[] calldata subscriptionIds,
        uint256[] calldata consumedCredits,
        uint256[] calldata deadlines,
        bytes[] calldata signatures
    ) external;

    function getConsumedCredits(uint256 subscriptionId) external view returns (uint256);
    function getSessionKey(address subscriber) external view returns (address);
}
