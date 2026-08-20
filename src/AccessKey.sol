// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPlanManager.sol";
import "./interfaces/ISubscriptionManager.sol";
import "./interfaces/IPaymentManager.sol";
import "./interfaces/IUsageSettlement.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title AccessKey
/// @notice Central registry and facade for the AccessKey protocol
contract AccessKey is AccessControl {
    IPlanManager public planManager;
    ISubscriptionManager public subscriptionManager;
    IPaymentManager public paymentManager;
    IUsageSettlement public usageSettlement;

    constructor(
        address _planManager,
        address _subscriptionManager,
        address _paymentManager,
        address _usageSettlement
    ) {
        planManager = IPlanManager(_planManager);
        subscriptionManager = ISubscriptionManager(_subscriptionManager);
        paymentManager = IPaymentManager(_paymentManager);
        usageSettlement = IUsageSettlement(_usageSettlement);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /// @notice Allows the admin to upgrade the underlying module addresses if needed
    function setModules(
        address _planManager,
        address _subscriptionManager,
        address _paymentManager,
        address _usageSettlement
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        planManager = IPlanManager(_planManager);
        subscriptionManager = ISubscriptionManager(_subscriptionManager);
        paymentManager = IPaymentManager(_paymentManager);
        usageSettlement = IUsageSettlement(_usageSettlement);
    }

    /// @notice Convenient wrapper for verifying access
    function hasAccess(address user, address provider) external view returns (bool) {
        return subscriptionManager.hasAccess(user, provider);
    }
}
