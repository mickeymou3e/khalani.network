// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {ILendingPoolAddressesProvider} from './ILendingPoolAddressesProvider.sol';
import {IAaveIncentivesController} from './tokens/IAaveIncentivesController.sol';

interface IUiPoolDataProvider {
  struct AggregatedReserveData {
    address underlyingAsset;
    string name;
    string symbol;
    uint256 decimals;
    uint256 baseLTVasCollateral;
    uint256 reserveLiquidationThreshold;
    uint256 reserveLiquidationBonus;
    uint256 reserveFactor;
    uint256 depositCap;
    uint256 borrowCap;
    bool usageAsCollateralEnabled;
    bool borrowingEnabled;
    bool stableBorrowRateEnabled;
    bool isActive;
    bool isFrozen;
    // base data
    uint128 liquidityIndex;
    uint128 variableBorrowIndex;
    uint128 liquidityRate;
    uint128 variableBorrowRate;
    uint128 stableBorrowRate;
    uint40 lastUpdateTimestamp;
    address aTokenAddress;
    address stableDebtTokenAddress;
    address variableDebtTokenAddress;
    address interestRateStrategyAddress;
   
    //
    uint256 availableLiquidity;
    uint256 totalPrincipalStableDebt;
    uint256 averageStableRate;
    uint256 stableDebtLastUpdateTimestamp;
    uint256 totalScaledVariableDebt;
    uint256 priceInEth;
    uint256 variableRateSlope1;
    uint256 variableRateSlope2;
    uint256 stableRateSlope1;
    uint256 stableRateSlope2;
    // incentives
    uint256 aEmissionPerSecond;
    uint256 vEmissionPerSecond;
    uint256 sEmissionPerSecond;
    uint256 aIncentivesLastUpdateTimestamp;
    uint256 vIncentivesLastUpdateTimestamp;
    uint256 sIncentivesLastUpdateTimestamp;
    uint256 aTokenIncentivesIndex;
    uint256 vTokenIncentivesIndex;
    uint256 sTokenIncentivesIndex;
  }

  struct UserData {
      uint256 totalCollateralETH;
      uint256 totalDebtETH;
      uint256 availableBorrowsETH;
      uint256 currentLiquidationThreshold;
      uint256 ltv;
      uint256 healthFactor;
  }

  struct UserReserveData{
    address underlyingAsset;
    bool usageAsCollateralEnabledOnUser;
  }

  struct BackstopPoolTokenData {
    address backstopAddress;
    string symbol;
    address tokenAddress;
    uint256 totalBalance;
    uint256 userBalance;
  }



  struct IncentivesControllerData {
    uint256 userUnclaimedRewards;
    uint256 emissionEndTimestamp;
  }

  function getReservesList(ILendingPoolAddressesProvider provider)
    external
    view
    returns (address[] memory);

  function incentivesController() external view returns (IAaveIncentivesController);

  function getSimpleReservesData(ILendingPoolAddressesProvider provider)
    external
    view
    returns (
      AggregatedReserveData[] memory,
      uint256 // emission end timestamp
    );

  function getReservesData(ILendingPoolAddressesProvider provider)
    external
    view
    returns (
      AggregatedReserveData[] memory
    );

  function getUserData(ILendingPoolAddressesProvider provider, address user)
    external
    view
    returns (
      UserReserveData[] memory,
      UserData memory
    );


  function getBackstopPools(ILendingPoolAddressesProvider provider, address user) external view returns (BackstopPoolTokenData[] memory);
}