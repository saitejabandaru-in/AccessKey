// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AccessKey.sol";
import "../src/PlanManager.sol";
import "../src/SubscriptionManager.sol";
import "../src/PaymentManager.sol";
import "../src/UsageSettlement.sol";
import "../src/mocks/MockUSDC.sol";
import "../src/mocks/MockV3Aggregator.sol";

contract AccessKeyIntegrationTest is Test {
    AccessKey public accessKey;
    PlanManager public planManager;
    SubscriptionManager public subscriptionManager;
    PaymentManager public paymentManager;
    UsageSettlement public usageSettlement;

    MockUSDC public usdc;
    MockV3Aggregator public ethOracle;

    address public providerAddr = address(0x10);
    address public userAddr = address(0x20);

    uint256 public pkUser = 0x20;

    function setUp() public {
        usdc = new MockUSDC();
        ethOracle = new MockV3Aggregator(8, 2000 * 1e8); // $2000 per ETH

        planManager = new PlanManager();
        planManager.setTokenWhitelist(address(usdc), true);
        paymentManager = new PaymentManager(500); // 5% fee
        subscriptionManager = new SubscriptionManager(address(planManager), address(paymentManager));
        usageSettlement = new UsageSettlement(address(subscriptionManager), address(planManager));

        accessKey = new AccessKey(
            address(planManager), address(subscriptionManager), address(paymentManager), address(usageSettlement)
        );

        // Setup Roles
        paymentManager.grantRole(paymentManager.SUBSCRIPTION_MANAGER_ROLE(), address(subscriptionManager));
        usageSettlement.grantRole(usageSettlement.SETTLEMENT_ROLE(), providerAddr);

        vm.deal(providerAddr, 100 ether);
        vm.deal(userAddr, 100 ether);

        usdc.mint(userAddr, 1000 * 1e6); // 1000 USDC
    }

    function test_Integration_FullWorkflowERC20() public {
        // 1. Provider creates a plan ($10 per month)
        vm.startPrank(providerAddr);
        // Let's just use raw token price for simplicity since Oracle math gets complex with USDC decimals vs ETH
        // We set priceFeed to address(0) for raw tokens. 10 USDC = 10 * 1e6
        uint256 planId =
            planManager.createPlan(10 * 1e6, address(usdc), address(0), 86400, 30 days, 1000, "ipfs://plan");
        vm.stopPrank();

        // 2. User subscribes
        vm.startPrank(userAddr);
        usdc.approve(address(paymentManager), 10 * 1e6);
        uint256 subId = subscriptionManager.subscribe(planId);
        vm.stopPrank();

        assertTrue(subscriptionManager.isSubscriptionValid(subId));

        // 3. Time passes (15 days)
        vm.warp(block.timestamp + 15 days);

        // 4. Provider withdraws earned funds (50% of $10 minus 5% fee)
        vm.startPrank(providerAddr);
        paymentManager.withdrawFromStream(subId);
        vm.stopPrank();

        uint256 providerBalance = usdc.balanceOf(providerAddr);
        // 10 USDC - 5% fee = 9.5 USDC total. Earned over 15 days = 4.75 USDC (4750000)
        assertEq(providerBalance, 4750000);

        // 5. User cancels
        vm.startPrank(userAddr);
        uint256 balanceBefore = usdc.balanceOf(userAddr);
        subscriptionManager.cancel(subId);
        uint256 balanceAfter = usdc.balanceOf(userAddr);
        vm.stopPrank();

        // User gets unearned portion (4.75 USDC)
        assertEq(balanceAfter - balanceBefore, 4750000);
        assertFalse(subscriptionManager.isSubscriptionValid(subId));
    }
}
