// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AccessKey.sol";
import "../src/PlanManager.sol";
import "../src/SubscriptionManager.sol";
import "../src/PaymentManager.sol";
import "../src/UsageSettlement.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Modules
        PlanManager planManager = new PlanManager();
        PaymentManager paymentManager = new PaymentManager(500); // 5% protocol fee
        SubscriptionManager subscriptionManager = new SubscriptionManager(address(planManager), address(paymentManager));
        UsageSettlement usageSettlement = new UsageSettlement(address(subscriptionManager), address(planManager));

        // 2. Deploy Facade
        AccessKey accessKey = new AccessKey(
            address(planManager), address(subscriptionManager), address(paymentManager), address(usageSettlement)
        );

        // 3. Configure Roles
        // SubscriptionManager needs to be able to create streams in PaymentManager
        paymentManager.grantRole(paymentManager.SUBSCRIPTION_MANAGER_ROLE(), address(subscriptionManager));

        // In a real deployment, the API Gateway (or a relayer wallet) would be granted the SETTLEMENT_ROLE
        // to submit user-signed usage settlements on-chain.
        // usageSettlement.grantRole(usageSettlement.SETTLEMENT_ROLE(), relayerAddress);

        vm.stopBroadcast();

        console.log("Deployment Successful:");
        console.log("PlanManager: ", address(planManager));
        console.log("PaymentManager: ", address(paymentManager));
        console.log("SubscriptionManager: ", address(subscriptionManager));
        console.log("UsageSettlement: ", address(usageSettlement));
        console.log("AccessKey: ", address(accessKey));
    }
}
