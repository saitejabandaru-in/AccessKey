// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AccessKey.sol";
import "../src/PlanManager.sol";
import "../src/SubscriptionManager.sol";
import "../src/PaymentManager.sol";
import "../src/UsageSettlement.sol";
import "../src/mocks/MockUSDC.sol";

contract AccessControlTest is Test {
    PlanManager public planManager;
    SubscriptionManager public subscriptionManager;
    PaymentManager public paymentManager;
    UsageSettlement public usageSettlement;

    address public admin = address(0x1);
    address public attacker = address(0x99);

    function setUp() public {
        vm.startPrank(admin);
        planManager = new PlanManager();
        paymentManager = new PaymentManager(500);
        subscriptionManager = new SubscriptionManager(address(planManager), address(paymentManager));
        usageSettlement = new UsageSettlement(address(subscriptionManager), address(planManager));
        vm.stopPrank();
    }

    function test_CannotSetWhitelistIfNotAdmin() public {
        vm.startPrank(attacker);
        vm.expectRevert(); // AccessControlUnauthorizedAccount
        planManager.setTokenWhitelist(address(0x123), true);
        vm.stopPrank();
    }

    function test_CannotProcessPaymentIfNotSubManager() public {
        vm.startPrank(attacker);
        vm.expectRevert(); // AccessControlUnauthorizedAccount
        paymentManager.processPayment(attacker, attacker, address(0), 100, 30 days, 1, address(0), 0);
        vm.stopPrank();
    }

    function test_CannotSettleUsageIfNotSettlementRole() public {
        vm.startPrank(attacker);
        vm.expectRevert(); // AccessControlUnauthorizedAccount
        usageSettlement.settleUsage(1, 100, block.timestamp + 100, "");
        vm.stopPrank();
    }
}
