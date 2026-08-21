// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PaymentManager.sol";
import "../src/PlanManager.sol";
import "../src/SubscriptionManager.sol";

contract MaliciousProvider {
    PaymentManager public paymentManager;
    uint256 public streamId;

    constructor(address _paymentManager) {
        paymentManager = PaymentManager(_paymentManager);
    }

    function setStreamId(uint256 _streamId) external {
        streamId = _streamId;
    }

    function attack() external {
        paymentManager.withdrawFromStream(streamId);
    }

    receive() external payable {
        // Attempt reentrancy on native ETH withdraw
        if (address(paymentManager).balance > 0) {
            // we catch the revert if it's protected
            try paymentManager.withdrawFromStream(streamId) {} catch {}
        }
    }
}

contract ReentrancyTest is Test {
    PlanManager public planManager;
    PaymentManager public paymentManager;
    SubscriptionManager public subscriptionManager;
    MaliciousProvider public attacker;

    function setUp() public {
        planManager = new PlanManager();
        paymentManager = new PaymentManager(0);
        subscriptionManager = new SubscriptionManager(address(planManager), address(paymentManager));

        paymentManager.grantRole(paymentManager.SUBSCRIPTION_MANAGER_ROLE(), address(subscriptionManager));

        attacker = new MaliciousProvider(address(paymentManager));
    }

    function test_WithdrawReentrancyIsMitigated() public {
        // 1. Setup plan for attacker
        vm.prank(address(attacker));
        uint256 planId = planManager.createPlan(1 ether, address(0), address(0), 86400, 30 days, 1000, "");

        // 2. Subscribe (sends 1 ETH)
        address user = address(0x2);
        vm.deal(user, 1 ether);
        vm.prank(user);
        uint256 subId = subscriptionManager.subscribe{value: 1 ether}(planId);

        attacker.setStreamId(subId);

        // 3. Fast forward so funds are earned
        vm.warp(block.timestamp + 30 days);

        // 4. Attacker attacks
        uint256 balBefore = address(attacker).balance;
        attacker.attack();
        uint256 balAfter = address(attacker).balance;

        // Attacker should only receive exactly 1 ETH, Reentrancy should fail
        assertEq(balAfter - balBefore, 1 ether);
    }
}
