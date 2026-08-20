// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IUsageSettlement.sol";
import "./interfaces/ISubscriptionManager.sol";
import "./interfaces/IPlanManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/// @title UsageSettlement
/// @notice Trustless settlement of API usage via user-signed state channels
contract UsageSettlement is IUsageSettlement, AccessControl, EIP712 {
    bytes32 public constant SETTLEMENT_ROLE = keccak256("SETTLEMENT_ROLE");
    bytes32 public constant USAGE_TYPEHASH = keccak256("Usage(uint256 subscriptionId,uint256 consumedCredits,uint256 deadline)");

    ISubscriptionManager public subscriptionManager;
    IPlanManager public planManager;

    mapping(uint256 => uint256) private _consumedCredits;

    constructor(address _subscriptionManager, address _planManager) EIP712("AccessKey", "1") {
        subscriptionManager = ISubscriptionManager(_subscriptionManager);
        planManager = IPlanManager(_planManager);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function settleUsage(
        uint256 subscriptionId,
        uint256 consumedCredits,
        uint256 deadline,
        bytes calldata signature
    ) external override onlyRole(SETTLEMENT_ROLE) {
        if (block.timestamp > deadline) revert ExpiredDeadline();
        
        ISubscriptionManager.Subscription memory sub = subscriptionManager.getSubscription(subscriptionId);
        if (sub.subscriptionId == 0) revert InvalidSubscription();

        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            USAGE_TYPEHASH,
            subscriptionId,
            consumedCredits,
            deadline
        )));

        // NEW TRUSTLESS MODEL: The API Gateway gets this signature from the USER (subscriber) before giving them the API response.
        // The provider then submits this user-signed proof to the blockchain.
        address signer = ECDSA.recover(digest, signature);
        if (signer != sub.subscriber) revert InvalidSignature();

        if (consumedCredits <= _consumedCredits[subscriptionId]) revert InvalidUsageAmount();

        IPlanManager.Plan memory plan = planManager.getPlan(sub.planId);
        if (consumedCredits > plan.allocatedCredits) revert ExceedsAllocatedCredits();

        _consumedCredits[subscriptionId] = consumedCredits;

        emit UsageSettled(subscriptionId, consumedCredits);
    }

    function getConsumedCredits(uint256 subscriptionId) external view override returns (uint256) {
        return _consumedCredits[subscriptionId];
    }
}
