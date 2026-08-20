// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PlanManager.sol";
import "../src/PaymentManager.sol";
import "../src/SubscriptionManager.sol";
import "../src/UsageSettlement.sol";
import "../src/AccessKey.sol";
import "../src/mocks/MockUSDC.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract AccessKeyIntegrationTest is Test {
    PlanManager public planManager;
    PaymentManager public paymentManager;
    SubscriptionManager public subscriptionManager;
    UsageSettlement public usageSettlement;
    AccessKey public accessKey;
    MockUSDC public usdc;

    address public admin = address(1);
    address public provider = address(0x2);
    uint256 public providerPk = 0x2; // Same as provider address if generated this way? Wait. Let's use makeAddrAndKey for provider to do signatures.
    
    // We will replace provider and user with valid sig keys.
    uint256 providerPrivKey;
    address providerAddr;
    
    uint256 userPrivKey;
    address userAddr;

    function setUp() public {
        (providerAddr, providerPrivKey) = makeAddrAndKey("provider");
        (userAddr, userPrivKey) = makeAddrAndKey("user");

        vm.startPrank(admin);
        
        planManager = new PlanManager();
        paymentManager = new PaymentManager(200); // 2% protocol fee
        subscriptionManager = new SubscriptionManager(address(planManager), address(paymentManager));
        usageSettlement = new UsageSettlement(address(subscriptionManager));
        
        accessKey = new AccessKey(
            address(planManager),
            address(subscriptionManager),
            address(paymentManager),
            address(usageSettlement)
        );

        // Grant SETTLEMENT_ROLE in SubscriptionManager to UsageSettlement
        bytes32 SETTLEMENT_ROLE = subscriptionManager.SETTLEMENT_ROLE();
        subscriptionManager.grantRole(SETTLEMENT_ROLE, address(usageSettlement));

        usdc = new MockUSDC();
        vm.stopPrank();

        // Give user some USDC
        usdc.mint(userAddr, 1000 * 1e6);
    }

    function test_Integration_FullWorkflowNativeETH() public {
        // Provider creates a plan
        vm.prank(providerAddr);
        uint256 planId = planManager.createPlan(
            0.1 ether,
            address(0), // Native ETH
            30 days,
            1000,
            "ipfs://plan"
        );

        // Give user some ETH
        vm.deal(userAddr, 1 ether);

        // User subscribes
        vm.startPrank(userAddr);
        uint256 subId = subscriptionManager.subscribe{value: 0.1 ether}(planId);
        vm.stopPrank();

        // Verify access
        assertTrue(accessKey.hasAccess(userAddr, providerAddr));

        // Check balances
        uint256 providerBal = paymentManager.getProviderBalance(providerAddr, address(0));
        assertEq(providerBal, 0.098 ether); // 98% of 0.1
        
        uint256 protocolFee = paymentManager.getProtocolFeeBalance(address(0));
        assertEq(protocolFee, 0.002 ether); // 2% of 0.1

        // Provider withdraws
        vm.startPrank(providerAddr);
        paymentManager.withdraw(address(0));
        assertEq(providerAddr.balance, 0.098 ether);
        vm.stopPrank();

        // Settle Usage
        bytes32 typeHash = keccak256("Settlement(uint256 subscriptionId,uint256 usageAmount,uint256 nonce,uint256 deadline)");
        uint256 nonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        uint256 usageAmount = 500;
        
        bytes32 structHash = keccak256(abi.encode(typeHash, subId, usageAmount, nonce, deadline));
        bytes32 domainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("AccessKey")),
                keccak256(bytes("1")),
                block.chainid,
                address(usageSettlement)
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(providerPrivKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        usageSettlement.settleUsage(subId, usageAmount, nonce, deadline, signature);

        // Check consumed credits
        ISubscriptionManager.Subscription memory sub = subscriptionManager.getSubscription(subId);
        assertEq(sub.consumedCredits, 500);

        // Still has access because 500 < 1000
        assertTrue(accessKey.hasAccess(userAddr, providerAddr));

        // Let's settle remaining 500 to exhaust
        nonce = 2;
        usageAmount = 500;
        structHash = keccak256(abi.encode(typeHash, subId, usageAmount, nonce, deadline));
        digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        (v, r, s) = vm.sign(providerPrivKey, digest);
        signature = abi.encodePacked(r, s, v);

        usageSettlement.settleUsage(subId, usageAmount, nonce, deadline, signature);

        // Now has no access
        assertFalse(accessKey.hasAccess(userAddr, providerAddr));
    }

    function test_Integration_FullWorkflowERC20() public {
        vm.prank(providerAddr);
        uint256 planId = planManager.createPlan(
            10 * 1e6,
            address(usdc),
            30 days,
            1000,
            "ipfs://plan-usdc"
        );

        vm.startPrank(userAddr);
        usdc.approve(address(paymentManager), 10 * 1e6);
        uint256 subId = subscriptionManager.subscribe(planId);
        vm.stopPrank();

        assertTrue(accessKey.hasAccess(userAddr, providerAddr));
        assertEq(usdc.balanceOf(address(paymentManager)), 10 * 1e6);
    }
}
