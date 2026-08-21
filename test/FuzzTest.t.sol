// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PlanManager.sol";

contract FuzzTest is Test {
    PlanManager public planManager;

    function setUp() public {
        planManager = new PlanManager();
    }

    function testFuzz_CreatePlan(uint256 price, uint256 duration, uint256 credits) public {
        // Bound inputs to reasonable ranges
        vm.assume(duration > 0);
        vm.assume(duration < 3650 days); // max 10 years
        vm.assume(price < type(uint128).max);

        uint256 planId = planManager.createPlan(price, address(0), address(0), 86400, duration, credits, "ipfs://fuzz");

        IPlanManager.Plan memory plan = planManager.getPlan(planId);

        assertEq(plan.price, price);
        assertEq(plan.duration, duration);
        assertEq(plan.allocatedCredits, credits);
        assertTrue(plan.isActive);
    }
}
