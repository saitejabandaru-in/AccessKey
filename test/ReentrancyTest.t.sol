// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PaymentManager.sol";

contract MaliciousReceiver {
    PaymentManager public paymentManager;
    uint256 public attackCount;

    constructor(PaymentManager _pm) {
        paymentManager = _pm;
    }

    receive() external payable {
        if (attackCount < 2) {
            attackCount++;
            // Try to re-enter
            paymentManager.withdraw(address(0));
        }
    }
}

contract ReentrancyTest is Test {
    PaymentManager public paymentManager;
    MaliciousReceiver public attacker;

    function setUp() public {
        paymentManager = new PaymentManager(0);
        attacker = new MaliciousReceiver(paymentManager);
    }

    function test_ReentrancyFails() public {
        // Simulate a payment going to the attacker
        vm.deal(address(this), 1 ether);
        paymentManager.processPayment{value: 1 ether}(
            address(this),
            address(attacker),
            address(0),
            1 ether,
            1
        );

        // Attacker attempts withdrawal
        vm.startPrank(address(attacker));
        vm.expectRevert(IPaymentManager.TransferFailed.selector);
        paymentManager.withdraw(address(0));
        vm.stopPrank();

        // The balance remains because the withdrawal reverted
        assertEq(address(attacker).balance, 0);
        // The attack count is 0 because the entire transaction reverted
        assertEq(attacker.attackCount(), 0); 
    }
}
