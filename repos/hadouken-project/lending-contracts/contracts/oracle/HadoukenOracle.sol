// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {Ownable} from '../dependencies/openzeppelin/contracts/Ownable.sol';
import {IERC20} from '../dependencies/openzeppelin/contracts/IERC20.sol';
import {IPriceOracleGetter} from '../interfaces/oracle/IPriceOracleGetter.sol';
import {SafeERC20} from '../dependencies/openzeppelin/contracts/SafeERC20.sol';

contract HadoukenOracle is IPriceOracleGetter, Ownable {
  using SafeERC20 for IERC20;

  IPriceOracleGetter private _oracle;
  IPriceOracleGetter private _fallbackOracle;

  event OracleUpdated(address indexed oracle);
  event FallbackOracleUpdated(address indexed fallbackOracle);

  constructor(
    address oracle,
    address fallbackOracle
  ) public {
    _setOracle(oracle);
    _setFallbackOracle(fallbackOracle);
  }

  /// @notice Gets an asset price by address
  /// @param asset The asset address
  function getAssetPrice(address asset) public view override returns (uint256) {
    uint256 price = _oracle.getAssetPrice(asset);

    if (price > 0) {
      return uint256(price);
    } else {
      return _fallbackOracle.getAssetPrice(asset);
    }
  }

  /// @notice Gets a list of prices from a list of assets addresses
  /// @param assets The list of assets addresses
  function getAssetsPrices(address[] calldata assets) external view returns (uint256[] memory) {
    uint256[] memory prices = new uint256[](assets.length);

    for (uint256 i = 0; i < assets.length; i++) {
      prices[i] = getAssetPrice(assets[i]);
    }

    return prices;
  }

  /// @notice Sets the oracle
  /// - Callable only by the Hadouken governance
  /// @param oracle The address of the oracle provider
  function setOracle(address oracle) external onlyOwner {
    _setOracle(oracle);
  }

  /// @notice Sets the fallbackOracle
  /// - Callable only by the Hadouken governance
  /// @param fallbackOracle The address of the fallbackOracle
  function setFallbackOracle(address fallbackOracle) external onlyOwner {
    _setFallbackOracle(fallbackOracle);
  }

  /// @notice Internal function to set the oracle
  /// @param oracle The address of the oracle
  function _setOracle(address oracle) internal {
    _oracle = IPriceOracleGetter(oracle);
    emit OracleUpdated(oracle);
  }

  /// @notice Internal function to set the fallbackOracle
  /// @param fallbackOracle The address of the fallbackOracle
  function _setFallbackOracle(address fallbackOracle) internal {
    _fallbackOracle = IPriceOracleGetter(fallbackOracle);
    emit FallbackOracleUpdated(fallbackOracle);
  }

}
