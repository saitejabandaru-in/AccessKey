// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IPlanManager
/// @notice Interface for provider plan management in AccessKey
interface IPlanManager {
    /// @notice Defines the structure of a subscription plan
    struct Plan {
        uint256 planId;
        address provider;
        uint256 price;
        address paymentToken; // address(0) for native ETH
        uint256 duration; // in seconds
        uint256 allocatedCredits;
        bool isActive;
        string metadataURI;
    }

    /// @notice Emitted when a new plan is created
    event PlanCreated(
        uint256 indexed planId, address indexed provider, uint256 price, uint256 duration, uint256 allocatedCredits
    );

    /// @notice Emitted when a plan is updated
    event PlanUpdated(
        uint256 indexed planId, address indexed provider, uint256 price, uint256 duration, uint256 allocatedCredits
    );

    /// @notice Emitted when a plan is activated
    event PlanActivated(uint256 indexed planId, address indexed provider);

    /// @notice Emitted when a plan is deactivated
    event PlanDeactivated(uint256 indexed planId, address indexed provider);

    /// @notice Custom Errors
    error UnauthorizedProvider();
    error PlanDoesNotExist();
    error InvalidPlanConfiguration();

    /// @notice Creates a new subscription plan
    function createPlan(
        uint256 price,
        address paymentToken,
        uint256 duration,
        uint256 allocatedCredits,
        string calldata metadataURI
    ) external returns (uint256 planId);

    /// @notice Updates an existing subscription plan
    function updatePlan(
        uint256 planId,
        uint256 price,
        address paymentToken,
        uint256 duration,
        uint256 allocatedCredits,
        string calldata metadataURI
    ) external;

    /// @notice Activates a plan
    function activatePlan(uint256 planId) external;

    /// @notice Deactivates a plan
    function deactivatePlan(uint256 planId) external;

    /// @notice Gets plan details
    function getPlan(uint256 planId) external view returns (Plan memory);

    /// @notice Checks if a plan is valid and active
    function isPlanActive(uint256 planId) external view returns (bool);
}
