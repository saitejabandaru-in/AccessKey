// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPlanManager.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

/// @title PlanManager
/// @notice Manages subscription plans for providers with Oracle support
contract PlanManager is IPlanManager, AccessControl {
    bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");

    uint256 private _nextPlanId = 1;
    mapping(uint256 => Plan) private _plans;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createPlan(
        uint256 price,
        address paymentToken,
        address priceFeed,
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
            priceFeed: priceFeed,
            duration: duration,
            allocatedCredits: allocatedCredits,
            isActive: true,
            metadataURI: metadataURI
        });

        emit PlanCreated(planId, msg.sender, price, priceFeed, duration, allocatedCredits);
    }

    function updatePlan(
        uint256 planId,
        uint256 price,
        address paymentToken,
        address priceFeed,
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
        plan.priceFeed = priceFeed;
        plan.duration = duration;
        plan.allocatedCredits = allocatedCredits;
        plan.metadataURI = metadataURI;

        emit PlanUpdated(planId, msg.sender, price, priceFeed, duration, allocatedCredits);
    }

    function activatePlan(uint256 planId) external override {
        Plan storage plan = _plans[planId];
        if (plan.planId == 0) revert PlanDoesNotExist();
        if (plan.provider != msg.sender) revert UnauthorizedProvider();

        plan.isActive = true;
        emit PlanActivated(planId, msg.sender);
    }

    function deactivatePlan(uint256 planId) external override {
        Plan storage plan = _plans[planId];
        if (plan.planId == 0) revert PlanDoesNotExist();
        if (plan.provider != msg.sender) revert UnauthorizedProvider();

        plan.isActive = false;
        emit PlanDeactivated(planId, msg.sender);
    }

    function getPlan(uint256 planId) external view override returns (Plan memory) {
        Plan memory plan = _plans[planId];
        if (plan.planId == 0) revert PlanDoesNotExist();
        return plan;
    }

    function isPlanActive(uint256 planId) external view override returns (bool) {
        return _plans[planId].isActive;
    }

    function getDynamicPrice(uint256 planId) external view override returns (uint256) {
        Plan memory plan = _plans[planId];
        if (plan.planId == 0) revert PlanDoesNotExist();

        if (plan.priceFeed == address(0)) {
            return plan.price; // Native token price
        }

        AggregatorV3Interface oracle = AggregatorV3Interface(plan.priceFeed);
        (, int256 price,,,) = oracle.latestRoundData();
        if (price <= 0) revert OracleError();

        uint8 oracleDecimals = oracle.decimals();

        // Dynamically compute the required payment amount based on the fiat price of the plan
        // plan.price is represented with 18 decimals (e.g. $10 = 10 * 10^18)
        // oracle price has oracleDecimals (e.g. $2000 = 2000 * 10^8)
        // requiredTokens = (plan.price * 10^oracleDecimals) / price
        return (plan.price * (10 ** oracleDecimals)) / uint256(price);
    }
}
