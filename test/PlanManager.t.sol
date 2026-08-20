// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PlanManager.sol";

contract PlanManagerTest is Test {
    PlanManager public planManager;
    address public provider = address(1);

    function setUp() public {
        planManager = new PlanManager();
    }

    function test_CreatePlan() public {
        vm.prank(provider);
        uint256 planId = planManager.createPlan(
            100e18,
            address(0),
            30 days,
            1000,
            "ipfs://metadata"
        );

        assertEq(planId, 1);
        IPlanManager.Plan memory plan = planManager.getPlan(planId);
        assertEq(plan.provider, provider);
        assertEq(plan.price, 100e18);
        assertEq(plan.duration, 30 days);
        assertTrue(plan.isActive);
    }
}
