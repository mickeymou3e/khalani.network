// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IVault.sol";
import "./IMinimalBalancerV2.sol";

/**
 * @title Rebalancer Interface
 * @notice Interface for a contract that rebalances assets in a given vault to a target ratio
 */
interface IRebalancer {
    event RebalancerCreated(address balancerAddress);
    event Rebalance(address indexed sender, uint256 targetRatio, bytes32 poolId);

    function balancer() external view returns (IMinimalBalancerVaultV2);

    /**
     * @notice Rebalances assets in the vault to the target ratio
     * @param _targetRatio The target allocation of asset A as a percentage (e.g., 50 for 50%).
     * @param _poolId The ID of the Balancer v2 pool to use for the swap.
     */
    function rebalance(uint256 _targetRatio, bytes32 _poolId) external;

    /**
     * @notice Calculates the current ratio of asset A to asset B in the pool
     * @param _poolId The ID of the pool to check
     * @return The current ratio of asset A to asset B in the pool
     */
    function calcCurrentRatio(bytes32 _poolId) external view returns (uint256);
}
