// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

/**
 * @title IPriceOracleGetter interface
 * @notice Interface for the Aave price oracle.
 **/

interface IPriceOracleGetter {
  /**
   * @dev returns the asset price in USD
   * @param asset the address of the asset
   * @return the USD price of the asset
   **/
  function getAssetPrice(address asset) external view returns (uint256);
}
