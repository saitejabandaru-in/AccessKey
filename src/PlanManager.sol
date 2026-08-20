// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPlanManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title PlanManager
/// @notice Manages subscription plans for providers
contract PlanManager is IPlanManager, AccessControl {
    bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");

    uint256 private _nextPlanId = 1;
    mapping(uint256 => Plan) private _plans;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Creates a new subscription plan
    function createPlan(
        uint256 price,
        address paymentToken,
        uint256 duration,
        uint256 allocatedCredits,
        string calldata metadataURI
    ) external override returns (uint256 planId) {
        if (duration == 0) revert InvalidPlanConfiguration();

        planId = _nextPlanId++;
        
        _plans[planId] = Plan({
            planId: planId,
            provider: msg.sender,
            price: price,
            paymentToken: paymentToken,
            duration: duration,
            allocatedCredits: allocatedCredits,
            isActive: true,
            metadataURI: metadataURI
        });

        emit PlanCreated(planId, msg.sender, price, duration, allocatedCredits);
    }

    /// @notice Updates an existing subscription plan
    function updatePlan(
        uint256 planId,
        uint256 price,
        address paymentToken,
        uint256 duration,
        uint256 allocatedCredits,
        string calldata metadataURI
    ) external override {
        Plan storage plan = _plans[planId];
        if (plan.planId == 0) revert PlanDoesNotExist();
        if (plan.provider != msg.sender) revert UnauthorizedProvider();
        if (duration == 0) revert InvalidPlanConfiguration();

        plan.price = price;
        plan.paymentToken = paymentToken;
        plan.duration = duration;
        plan.allocatedCredits = allocatedCredits;
        plan.metadataURI = metadataURI;

        emit PlanUpdated(planId, msg.sender, price, duration, allocatedCredits);
    }

    /// @notice Activates a plan
    function activatePlan(uint256 planId) external override {
        Plan storage plan = _plans[planId];
        if (plan.planId == 0) revert PlanDoesNotExist();
        if (plan.provider != msg.sender) revert UnauthorizedProvider();

        plan.isActive = true;
        emit PlanActivated(planId, msg.sender);
    }

    /// @notice Deactivates a plan
    function deactivatePlan(uint256 planId) external override {
        Plan storage plan = _plans[planId];
        if (plan.planId == 0) revert PlanDoesNotExist();
        if (plan.provider != msg.sender) revert UnauthorizedProvider();

        plan.isActive = false;
        emit PlanDeactivated(planId, msg.sender);
    }

    /// @notice Gets plan details
    function getPlan(uint256 planId) external view override returns (Plan memory) {
        Plan memory plan = _plans[planId];
        if (plan.planId == 0) revert PlanDoesNotExist();
        return plan;
    }

    /// @notice Checks if a plan is valid and active
    function isPlanActive(uint256 planId) external view override returns (bool) {
        return _plans[planId].isActive;
    }
}
