// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ISubscriptionManager
/// @notice Interface for subscription lifecycle management
interface ISubscriptionManager {
    enum SubscriptionStatus {
        NONE,
        ACTIVE,
        CANCELLED,
        EXPIRED,
        PAUSED,
        REVOKED
    }

    struct Subscription {
        uint256 subscriptionId;
        address subscriber;
        address provider;
        uint256 planId;
        uint256 startTime;
        uint256 expiryTime;
        uint256 allocatedCredits;
        uint256 consumedCredits;
        SubscriptionStatus status;
    }

    /// @notice Events
    event SubscriptionCreated(
        uint256 indexed subscriptionId, address indexed subscriber, uint256 indexed planId, uint256 expiryTime
    );
    event SubscriptionRenewed(uint256 indexed subscriptionId, uint256 newExpiryTime);
    event SubscriptionCancelled(uint256 indexed subscriptionId);
    event SubscriptionUpgraded(uint256 indexed subscriptionId, uint256 newPlanId);
    event SubscriptionDowngraded(uint256 indexed subscriptionId, uint256 newPlanId);
    event SubscriptionPaused(uint256 indexed subscriptionId);
    event SubscriptionUnpaused(uint256 indexed subscriptionId);
    event SubscriptionRevoked(uint256 indexed subscriptionId);

    /// @notice Errors
    error InvalidSubscription();
    error UnauthorizedSubscriber();
    error SubscriptionAlreadyActive();
    error SubscriptionNotActive();
    error CannotDowngradeSamePlan();
    error CannotUpgradeSamePlan();
    error InvalidStateTransition();

    /// @notice Subscribes a user to a plan
    function subscribe(uint256 planId) external payable returns (uint256 subscriptionId);

    /// @notice Renews an existing subscription
    function renew(uint256 subscriptionId) external payable;

    /// @notice Cancels a subscription (stops auto-renewal, access valid until expiry)
    function cancel(uint256 subscriptionId) external;

    /// @notice Upgrades a subscription to a new plan
    function upgrade(uint256 subscriptionId, uint256 newPlanId) external payable;

    /// @notice Downgrades a subscription to a new plan (takes effect next renewal)
    function downgrade(uint256 subscriptionId, uint256 newPlanId) external;

    /// @notice Gets subscription details
    function getSubscription(uint256 subscriptionId) external view returns (Subscription memory);

    /// @notice Checks if a user has access to a provider's plan
    function hasAccess(address user, address provider) external view returns (bool);
}
