// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

interface IVault {
    event VaultCreated(address vaultAddress, address poolAddress);
    event Deposit(address indexed sender, uint256 amount0, uint256 amount1);
    event RebalancerUpdated(address rebalancerAddress);

    function token0() external view returns (IERC20);
    function token1() external view returns (IERC20);

    function deposit(uint256 amount0, uint256 amount1) external;
}
