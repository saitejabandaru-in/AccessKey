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
        vm.assume(duration > 0);
        vm.assume(duration < 3650 days); // reasonable max
        
        vm.prank(address(0x1));
        uint256 planId = planManager.createPlan(price, address(0), duration, credits, "");
        
        IPlanManager.Plan memory p = planManager.getPlan(planId);
        assertEq(p.price, price);
        assertEq(p.duration, duration);
        assertEq(p.allocatedCredits, credits);
    }
}
