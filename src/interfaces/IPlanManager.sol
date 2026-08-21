// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPlanManager {
    struct Plan {
        uint256 planId;
        address provider;
        uint256 price; // In fiat or token depending on priceFeed
        address paymentToken; // address(0) for native ETH
        address priceFeed; // Chainlink aggregator. If address(0), price is raw token amount.
        uint256 duration; // in seconds
        uint256 allocatedCredits;
        bool isActive;
        string metadataURI;
    }

    event PlanCreated(
        uint256 indexed planId,
        address indexed provider,
        uint256 price,
        address priceFeed,
        uint256 duration,
        uint256 allocatedCredits
    );
    event PlanUpdated(
        uint256 indexed planId,
        address indexed provider,
        uint256 price,
        address priceFeed,
        uint256 duration,
        uint256 allocatedCredits
    );
    event PlanActivated(uint256 indexed planId, address indexed provider);
    event PlanDeactivated(uint256 indexed planId, address indexed provider);

    error UnauthorizedProvider();
    error PlanDoesNotExist();
    error InvalidPlanConfiguration();
    error OracleError();

    function createPlan(
        uint256 price,
        address paymentToken,
        address priceFeed,
        uint256 duration,
        uint256 allocatedCredits,
        string calldata metadataURI
    ) external returns (uint256 planId);

    function updatePlan(
        uint256 planId,
        uint256 price,
        address paymentToken,
        address priceFeed,
        uint256 duration,
        uint256 allocatedCredits,
        string calldata metadataURI
    ) external;

    function activatePlan(uint256 planId) external;
    function deactivatePlan(uint256 planId) external;
    function getPlan(uint256 planId) external view returns (Plan memory);
    function isPlanActive(uint256 planId) external view returns (bool);
    function getDynamicPrice(uint256 planId) external view returns (uint256);
}
