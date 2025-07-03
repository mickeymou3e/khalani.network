// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract UserBalances {
  function balancesOf(address user, IERC20[] memory tokens) external
    view
    returns (uint256[] memory balances) 
  {
    balances = new uint256[](tokens.length);
    for (uint256 i = 0; i < tokens.length; i++) {
      IERC20 erc20 = IERC20(tokens[i]);
      balances[i] = erc20.balanceOf(user);
    }
  }
}