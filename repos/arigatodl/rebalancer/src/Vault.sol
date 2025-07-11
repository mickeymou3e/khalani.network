// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

import "./IVault.sol";
import "./IRebalancer.sol";

contract Vault is IVault {
    using SafeERC20 for IERC20;

    // Define the two assets that the vault will custody
    IERC20 public immutable override token0;
    IERC20 public immutable override token1;
    IRebalancer public rebalancer;
    address public immutable owner;

    constructor(address _token0Address, address _token1Address) {
        require(_token0Address != address(0), "_token0Address cannot be zero");
        require(_token1Address != address(0), "_token1Address cannot be zero");

        token0 = IERC20(_token0Address);
        token1 = IERC20(_token1Address);
        owner = msg.sender;

        emit VaultCreated(_token0Address, _token1Address);
    }

    function deposit(uint256 amount0, uint256 amount1) external {
        // Transfer the tokens to the vault
        token0.safeTransferFrom(msg.sender, address(this), amount0);
        token1.safeTransferFrom(msg.sender, address(this), amount1);

        emit Deposit(msg.sender, amount0, amount1);
    }

    function setRebalancer(address _rebalancerAddress) external onlyOwner {
        require(_rebalancerAddress != address(0), "_rebalancerAddress cannot be zero");
        require(rebalancer != IRebalancer(_rebalancerAddress), "same rebalancer");

        rebalancer = IRebalancer(_rebalancerAddress);

        emit RebalancerUpdated(_rebalancerAddress);
    }

    function rebalance(uint256 _targetRatio, bytes32 _poolId) external onlyOwner {
        rebalancer.rebalance(_targetRatio, _poolId);
    }

    function estimateCurrentRatio(bytes32 _poolId) external view returns (uint256) {
        return rebalancer.calcCurrentRatio(_poolId);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }
}
