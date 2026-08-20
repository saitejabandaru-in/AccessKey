// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IPlanManager.sol";

interface ISubscriptionManager {
    enum SubscriptionStatus { NONE, ACTIVE, CANCELLED, EXPIRED }

    struct Subscription {
        uint256 subscriptionId;
        uint256 planId;
        address subscriber;
        address provider;
        uint256 startTime;
        uint256 expiryTime;
        SubscriptionStatus status;
    }

    event Subscribed(uint256 indexed subscriptionId, uint256 indexed planId, address indexed subscriber);
    event SubscriptionCancelled(uint256 indexed subscriptionId);
    event SubscriptionUpgraded(uint256 indexed oldSubscriptionId, uint256 indexed newSubscriptionId, uint256 newPlanId);
    event SubscriptionRenewed(uint256 indexed subscriptionId, uint256 newExpiryTime);

    error InactivePlan();
    error NotSubscriber();
    error InvalidSubscription();
    error AlreadyCancelled();
    error SubscriptionExpired();
    error CannotUpgradeToSamePlan();

    function subscribe(uint256 planId) external payable returns (uint256 subscriptionId);
    function cancel(uint256 subscriptionId) external;
    function renew(uint256 subscriptionId) external payable;
    function executeAutoRenewal(uint256 subscriptionId) external payable;
    function upgrade(uint256 subscriptionId, uint256 newPlanId) external payable returns (uint256 newSubscriptionId);
    function getSubscription(uint256 subscriptionId) external view returns (Subscription memory);
    function isSubscriptionValid(uint256 subscriptionId) external view returns (bool);
    function getProviderForSubscription(uint256 subscriptionId) external view returns (address);
}
