// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PlanManager.sol";

contract AccessControlTest is Test {
    PlanManager public planManager;

    function setUp() public {
        planManager = new PlanManager();
    }

    function test_CannotUpdateOtherProviderPlan() public {
        vm.prank(address(1));
        uint256 planId = planManager.createPlan(100, address(0), 30 days, 1000, "");

        vm.prank(address(2)); // different provider
        vm.expectRevert(IPlanManager.UnauthorizedProvider.selector);
        planManager.updatePlan(planId, 200, address(0), 30 days, 2000, "");
    }
}
