// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IUsageSettlement.sol";
import "./interfaces/ISubscriptionManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

interface ISubManagerExt is ISubscriptionManager {
    function addConsumedCredits(uint256 subscriptionId, uint256 amount) external;
}

/// @title UsageSettlement
/// @notice Handles signed off-chain usage settlement
contract UsageSettlement is IUsageSettlement, EIP712, AccessControl {
    ISubManagerExt public immutable subscriptionManager;

    bytes32 private constant SETTLEMENT_TYPEHASH =
        keccak256("Settlement(uint256 subscriptionId,uint256 usageAmount,uint256 nonce,uint256 deadline)");

    mapping(address => mapping(uint256 => bool)) private _usedNonces;

    constructor(address _subscriptionManager) EIP712("AccessKey", "1") {
        subscriptionManager = ISubManagerExt(_subscriptionManager);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Settles usage based on a signed report from the provider
    function settleUsage(
        uint256 subscriptionId,
        uint256 usageAmount,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external override {
        if (block.timestamp > deadline) revert ExpiredDeadline();

        ISubscriptionManager.Subscription memory sub = subscriptionManager.getSubscription(subscriptionId);

        if (_usedNonces[sub.provider][nonce]) revert NonceAlreadyUsed();
        if (sub.consumedCredits + usageAmount > sub.allocatedCredits) revert ExceedsAllocatedCredits();

        bytes32 structHash = keccak256(abi.encode(SETTLEMENT_TYPEHASH, subscriptionId, usageAmount, nonce, deadline));
        bytes32 digest = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(digest, signature);

        // The signer must be the provider
        if (signer != sub.provider) revert InvalidSignature();

        _usedNonces[sub.provider][nonce] = true;

        subscriptionManager.addConsumedCredits(subscriptionId, usageAmount);

        emit UsageSettled(subscriptionId, sub.provider, usageAmount, nonce);
    }

    /// @notice Checks if a settlement nonce has been used
    function isNonceUsed(address provider, uint256 nonce) external view override returns (bool) {
        return _usedNonces[provider][nonce];
    }
}
