// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/ISubscriptionManager.sol";
import "./interfaces/IPlanManager.sol";
import "./interfaces/IPaymentManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title SubscriptionManager
/// @notice Handles user subscriptions, renewals, and cancellations
contract SubscriptionManager is ISubscriptionManager, AccessControl {
    bytes32 public constant SECURITY_ADMIN_ROLE = keccak256("SECURITY_ADMIN_ROLE");
    bytes32 public constant SUBSCRIPTION_ADMIN_ROLE = keccak256("SUBSCRIPTION_ADMIN_ROLE"); // For pausing etc.

    IPlanManager public immutable planManager;
    IPaymentManager public immutable paymentManager;

    uint256 private _nextSubscriptionId = 1;
    mapping(uint256 => Subscription) private _subscriptions;

    // Optional: user -> provider -> active subscription ID
    mapping(address => mapping(address => uint256)) private _userSubscriptions;

    constructor(address _planManager, address _paymentManager) {
        planManager = IPlanManager(_planManager);
        paymentManager = IPaymentManager(_paymentManager);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Subscribes a user to a plan
    function subscribe(uint256 planId) external payable override returns (uint256 subscriptionId) {
        IPlanManager.Plan memory plan = planManager.getPlan(planId);
        if (!plan.isActive) revert IPlanManager.PlanDoesNotExist();

        subscriptionId = _nextSubscriptionId++;
        
        uint256 expiry = block.timestamp + plan.duration;

        _subscriptions[subscriptionId] = Subscription({
            subscriptionId: subscriptionId,
            subscriber: msg.sender,
            provider: plan.provider,
            planId: planId,
            startTime: block.timestamp,
            expiryTime: expiry,
            allocatedCredits: plan.allocatedCredits,
            consumedCredits: 0,
            status: SubscriptionStatus.ACTIVE
        });

        _userSubscriptions[msg.sender][plan.provider] = subscriptionId;

        paymentManager.processPayment{value: msg.value}(
            msg.sender,
            plan.provider,
            plan.paymentToken,
            plan.price,
            subscriptionId
        );

        emit SubscriptionCreated(subscriptionId, msg.sender, planId, expiry);
    }

    /// @notice Renews an existing subscription
    function renew(uint256 subscriptionId) external payable override {
        Subscription storage sub = _subscriptions[subscriptionId];
        if (sub.subscriber != msg.sender) revert UnauthorizedSubscriber();
        if (sub.status == SubscriptionStatus.REVOKED) revert InvalidStateTransition();

        IPlanManager.Plan memory plan = planManager.getPlan(sub.planId);
        if (!plan.isActive) revert IPlanManager.PlanDoesNotExist();

        // If expired or cancelled, set status to ACTIVE and start from now
        if (block.timestamp > sub.expiryTime || sub.status == SubscriptionStatus.CANCELLED) {
            sub.startTime = block.timestamp;
            sub.expiryTime = block.timestamp + plan.duration;
            sub.status = SubscriptionStatus.ACTIVE;
        } else {
            // Otherwise add duration to current expiry
            sub.expiryTime += plan.duration;
        }

        // Reset consumed credits or add them? Standard is to reset for simple tiers or add.
        // For AccessKey, we reset consumed credits on renewal to allocated credits.
        sub.allocatedCredits = plan.allocatedCredits;
        sub.consumedCredits = 0;

        paymentManager.processPayment{value: msg.value}(
            msg.sender,
            plan.provider,
            plan.paymentToken,
            plan.price,
            subscriptionId
        );

        emit SubscriptionRenewed(subscriptionId, sub.expiryTime);
    }

    /// @notice Cancels a subscription
    function cancel(uint256 subscriptionId) external override {
        Subscription storage sub = _subscriptions[subscriptionId];
        if (sub.subscriber != msg.sender) revert UnauthorizedSubscriber();
        if (sub.status != SubscriptionStatus.ACTIVE) revert InvalidStateTransition();

        sub.status = SubscriptionStatus.CANCELLED;
        emit SubscriptionCancelled(subscriptionId);
    }

    /// @notice Upgrades a subscription to a new plan
    function upgrade(uint256 subscriptionId, uint256 newPlanId) external payable override {
        Subscription storage sub = _subscriptions[subscriptionId];
        if (sub.subscriber != msg.sender) revert UnauthorizedSubscriber();
        if (sub.status != SubscriptionStatus.ACTIVE) revert InvalidStateTransition();
        if (sub.planId == newPlanId) revert CannotUpgradeSamePlan();

        IPlanManager.Plan memory newPlan = planManager.getPlan(newPlanId);
        if (!newPlan.isActive || newPlan.provider != sub.provider) revert IPlanManager.PlanDoesNotExist();

        // For V1 simplicity, upgrade takes effect immediately, charging full price.
        // More complex proration is omitted here, documented in ADR.
        sub.planId = newPlanId;
        sub.startTime = block.timestamp;
        sub.expiryTime = block.timestamp + newPlan.duration;
        sub.allocatedCredits = newPlan.allocatedCredits;
        sub.consumedCredits = 0;

        paymentManager.processPayment{value: msg.value}(
            msg.sender,
            newPlan.provider,
            newPlan.paymentToken,
            newPlan.price,
            subscriptionId
        );

        emit SubscriptionUpgraded(subscriptionId, newPlanId);
    }

    /// @notice Downgrades a subscription to a new plan (takes effect next renewal)
    function downgrade(uint256 subscriptionId, uint256 newPlanId) external override {
        Subscription storage sub = _subscriptions[subscriptionId];
        if (sub.subscriber != msg.sender) revert UnauthorizedSubscriber();
        if (sub.status != SubscriptionStatus.ACTIVE) revert InvalidStateTransition();
        if (sub.planId == newPlanId) revert CannotDowngradeSamePlan();

        IPlanManager.Plan memory newPlan = planManager.getPlan(newPlanId);
        if (!newPlan.isActive || newPlan.provider != sub.provider) revert IPlanManager.PlanDoesNotExist();

        // Will take effect on renewal by just setting the plan ID.
        // Active credits/time remain unchanged until renewal.
        sub.planId = newPlanId;

        emit SubscriptionDowngraded(subscriptionId, newPlanId);
    }

    /// @notice Gets subscription details
    function getSubscription(uint256 subscriptionId) external view override returns (Subscription memory) {
        Subscription memory sub = _subscriptions[subscriptionId];
        if (sub.subscriptionId == 0) revert InvalidSubscription();
        return sub;
    }

    /// @notice Checks if a user has access to a provider's plan
    function hasAccess(address user, address provider) external view override returns (bool) {
        uint256 subId = _userSubscriptions[user][provider];
        if (subId == 0) return false;

        Subscription memory sub = _subscriptions[subId];
        if (sub.status == SubscriptionStatus.REVOKED || sub.status == SubscriptionStatus.PAUSED) return false;
        
        // Cancelled subscriptions are valid until expiry
        if (block.timestamp > sub.expiryTime) return false;
        
        if (sub.consumedCredits >= sub.allocatedCredits) return false;

        return true;
    }

    bytes32 public constant SETTLEMENT_ROLE = keccak256("SETTLEMENT_ROLE");

    /// @notice Used by UsageSettlement to update consumed credits
    function addConsumedCredits(uint256 subscriptionId, uint256 amount) external onlyRole(SETTLEMENT_ROLE) {
        _subscriptions[subscriptionId].consumedCredits += amount;
    }
}
