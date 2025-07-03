// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {IERC20Detailed} from '../dependencies/openzeppelin/contracts/IERC20Detailed.sol';
import {ILendingPoolAddressesProvider} from '../interfaces/ILendingPoolAddressesProvider.sol';
import {IAaveIncentivesController} from '../interfaces/tokens/IAaveIncentivesController.sol';
import {IUiPoolDataProvider} from '../interfaces/IUiPoolDataProvider.sol';
import {ILendingPool} from '../interfaces/ILendingPool.sol';
import {IPriceOracleGetter} from '../interfaces/oracle/IPriceOracleGetter.sol';
import {IAToken} from '../interfaces/tokens/IAToken.sol';
import {IVariableDebtToken} from '../interfaces/tokens/IVariableDebtToken.sol';
import {IBAMM} from '../interfaces/IBAMM.sol';
import {IStableDebtToken} from '../interfaces/tokens/IStableDebtToken.sol';
import {WadRayMath} from '../protocol/libraries/math/WadRayMath.sol';
import {ReserveConfiguration} from '../protocol/libraries/configuration/ReserveConfiguration.sol';
import {UserConfiguration} from '../protocol/libraries/configuration/UserConfiguration.sol';
import {DataTypes} from '../protocol/libraries/types/DataTypes.sol';
import {
  DefaultReserveInterestRateStrategy
} from '../protocol/lendingpool/DefaultReserveInterestRateStrategy.sol';

contract UiPoolDataProvider is IUiPoolDataProvider {
  using WadRayMath for uint256;
  using ReserveConfiguration for DataTypes.ReserveConfigurationMap;
  using UserConfiguration for DataTypes.UserConfigurationMap;

  IAaveIncentivesController public immutable override incentivesController;
  IPriceOracleGetter public immutable oracle;

  constructor(IAaveIncentivesController _incentivesController, IPriceOracleGetter _oracle) public {
    incentivesController = _incentivesController;
    oracle = _oracle;
  }

  function getInterestRateStrategySlopes(DefaultReserveInterestRateStrategy interestRateStrategy)
    internal
    view
    returns (
      uint256,
      uint256,
      uint256,
      uint256
    )
  {
    return (
      interestRateStrategy.variableRateSlope1(),
      interestRateStrategy.variableRateSlope2(),
      interestRateStrategy.stableRateSlope1(),
      interestRateStrategy.stableRateSlope2()
    );
  }

  function getReservesList(ILendingPoolAddressesProvider provider)
    public
    view
    override
    returns (address[] memory)
  {
    ILendingPool lendingPool = ILendingPool(provider.getLendingPool());
    return lendingPool.getReservesList();
  }

  function getSimpleReservesData(ILendingPoolAddressesProvider provider)
    public
    view
    override
    returns (
      AggregatedReserveData[] memory,
      uint256
    )
  {
    ILendingPool lendingPool = ILendingPool(provider.getLendingPool());
    address[] memory reserves = lendingPool.getReservesList();
    AggregatedReserveData[] memory reservesData = new AggregatedReserveData[](reserves.length);

    for (uint256 i = 0; i < reserves.length; i++) {
      AggregatedReserveData memory reserveData = reservesData[i];
      reserveData.underlyingAsset = reserves[i];

      // reserve current state
      DataTypes.ReserveData memory baseData =
        lendingPool.getReserveData(reserveData.underlyingAsset);
      reserveData.liquidityIndex = baseData.liquidityIndex;
      reserveData.variableBorrowIndex = baseData.variableBorrowIndex;
      reserveData.liquidityRate = baseData.currentLiquidityRate;
      reserveData.variableBorrowRate = baseData.currentVariableBorrowRate;
      reserveData.stableBorrowRate = baseData.currentStableBorrowRate;
      reserveData.lastUpdateTimestamp = baseData.lastUpdateTimestamp;
      reserveData.aTokenAddress = baseData.aTokenAddress;
      reserveData.stableDebtTokenAddress = baseData.stableDebtTokenAddress;
      reserveData.variableDebtTokenAddress = baseData.variableDebtTokenAddress;
      reserveData.interestRateStrategyAddress = baseData.interestRateStrategyAddress;
      reserveData.priceInEth = oracle.getAssetPrice(reserveData.underlyingAsset);

      reserveData.availableLiquidity = IERC20Detailed(reserveData.underlyingAsset).balanceOf(
        reserveData.aTokenAddress
      );
      (
        reserveData.totalPrincipalStableDebt,
        ,
        reserveData.averageStableRate,
        reserveData.stableDebtLastUpdateTimestamp
      ) = IStableDebtToken(reserveData.stableDebtTokenAddress).getSupplyData();
      reserveData.totalScaledVariableDebt = IVariableDebtToken(reserveData.variableDebtTokenAddress)
        .scaledTotalSupply();

      // reserve configuration

      // we're getting this info from the aToken, because some of assets can be not compliant with ETC20Detailed
      reserveData.symbol = IERC20Detailed(reserveData.underlyingAsset).symbol();
      reserveData.name = '';

      (
        reserveData.baseLTVasCollateral,
        reserveData.reserveLiquidationThreshold,
        reserveData.reserveLiquidationBonus,
        reserveData.decimals,
        reserveData.reserveFactor,
        reserveData.borrowCap,
        reserveData.depositCap
      ) = baseData.configuration.getParamsMemory();
      (
        reserveData.isActive,
        reserveData.isFrozen,
        reserveData.borrowingEnabled,
        reserveData.stableBorrowRateEnabled
      ) = baseData.configuration.getFlagsMemory();
      reserveData.usageAsCollateralEnabled = reserveData.baseLTVasCollateral != 0;
      (
        reserveData.variableRateSlope1,
        reserveData.variableRateSlope2,
        reserveData.stableRateSlope1,
        reserveData.stableRateSlope2
      ) = getInterestRateStrategySlopes(
        DefaultReserveInterestRateStrategy(reserveData.interestRateStrategyAddress)
      );

      // incentives
      if (address(0) != address(incentivesController)) {
        (
          reserveData.aTokenIncentivesIndex,
          reserveData.aEmissionPerSecond,
          reserveData.aIncentivesLastUpdateTimestamp
        ) = incentivesController.getAssetData(reserveData.aTokenAddress);
     
        (
          reserveData.sTokenIncentivesIndex,
          reserveData.sEmissionPerSecond,
          reserveData.sIncentivesLastUpdateTimestamp
        ) = incentivesController.getAssetData(reserveData.stableDebtTokenAddress);
     
        (
          reserveData.vTokenIncentivesIndex,
          reserveData.vEmissionPerSecond,
          reserveData.vIncentivesLastUpdateTimestamp
        ) = incentivesController.getAssetData(reserveData.variableDebtTokenAddress);
      }
    }

    uint256 emissionEndTimestamp;
    if (address(0) != address(incentivesController)) {
      emissionEndTimestamp = incentivesController.DISTRIBUTION_END();
    }

    return (reservesData, emissionEndTimestamp);
  }

    function getUserData(ILendingPoolAddressesProvider provider, address user)
    external
    view
    override
    returns (
      UserReserveData[] memory,
      UserData memory) 
    {
      ILendingPool lendingPool = ILendingPool(provider.getLendingPool());
      DataTypes.UserConfigurationMap memory userConfig = lendingPool.getUserConfiguration(user);
      address[] memory reserves = lendingPool.getReservesList();


      UserReserveData[] memory userReservesData =
        new UserReserveData[](user != address(0) ? reserves.length : 0);

      for (uint256 i = 0; i < reserves.length; i++) {
          userReservesData[i].underlyingAsset = reserves[i];
          userReservesData[i].usageAsCollateralEnabledOnUser = userConfig.isUsingAsCollateral(i);
      }


      (
        uint256 totalCollateralETH,
        uint256 totalDebtETH,
        uint256 availableBorrowsETH,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor
      ) = lendingPool.getUserAccountData(user);


      UserData memory userData = UserData(totalCollateralETH, totalDebtETH, availableBorrowsETH, currentLiquidationThreshold, ltv, healthFactor);
      return (userReservesData, userData);
  }

function getReservesData(ILendingPoolAddressesProvider provider)
    public
    view
    override
    returns (AggregatedReserveData[] memory)
  {
    ILendingPool lendingPool = ILendingPool(provider.getLendingPool());
    address[] memory reserves = lendingPool.getReservesList();
    AggregatedReserveData[] memory reservesData = new AggregatedReserveData[](reserves.length);

    for (uint256 i = 0; i < reserves.length; i++) {
      AggregatedReserveData memory reserveData = reservesData[i];
      reserveData.underlyingAsset = reserves[i];

      // reserve current state
      DataTypes.ReserveData memory baseData = lendingPool.getReserveData(
        reserveData.underlyingAsset
      );
      reserveData.liquidityIndex = baseData.liquidityIndex;
      reserveData.variableBorrowIndex = baseData.variableBorrowIndex;
      reserveData.liquidityRate = baseData.currentLiquidityRate;
      reserveData.variableBorrowRate = baseData.currentVariableBorrowRate;
      reserveData.stableBorrowRate = baseData.currentStableBorrowRate;
      reserveData.lastUpdateTimestamp = baseData.lastUpdateTimestamp;
      reserveData.aTokenAddress = baseData.aTokenAddress;
      reserveData.stableDebtTokenAddress = baseData.stableDebtTokenAddress;
      reserveData.variableDebtTokenAddress = baseData.variableDebtTokenAddress;
      reserveData.interestRateStrategyAddress = baseData.interestRateStrategyAddress;

      reserveData.availableLiquidity = IERC20Detailed(reserveData.underlyingAsset).balanceOf(
        reserveData.aTokenAddress
      );
      (
        reserveData.totalPrincipalStableDebt,
        ,
        reserveData.averageStableRate,
        reserveData.stableDebtLastUpdateTimestamp
      ) = IStableDebtToken(reserveData.stableDebtTokenAddress).getSupplyData();
      reserveData.totalScaledVariableDebt = IVariableDebtToken(reserveData.variableDebtTokenAddress)
        .scaledTotalSupply();


      reserveData.symbol = IERC20Detailed(reserveData.underlyingAsset).symbol();
      

      (
        reserveData.baseLTVasCollateral,
        reserveData.reserveLiquidationThreshold,
        reserveData.reserveLiquidationBonus,
        reserveData.decimals,
        reserveData.reserveFactor,
        reserveData.borrowCap,
        reserveData.depositCap
      ) = baseData.configuration.getParamsMemory();
      (
        reserveData.isActive,
        reserveData.isFrozen,
        reserveData.borrowingEnabled,
        reserveData.stableBorrowRateEnabled
      ) = baseData.configuration.getFlagsMemory();
      reserveData.usageAsCollateralEnabled = reserveData.baseLTVasCollateral != 0;
      (
        reserveData.variableRateSlope1,
        reserveData.variableRateSlope2,
        reserveData.stableRateSlope1,
        reserveData.stableRateSlope2
      ) = getInterestRateStrategySlopes(
        DefaultReserveInterestRateStrategy(reserveData.interestRateStrategyAddress)
      );
    }
    return (reservesData);
  }

  function getBackstopPools(ILendingPoolAddressesProvider provider, address user) override external view returns (IUiPoolDataProvider.BackstopPoolTokenData[] memory)  {
    ILendingPool pool = ILendingPool(provider.getLendingPool());
    address[] memory reserves = pool.getReservesList();
    BackstopPoolTokenData[] memory backstopPools = new BackstopPoolTokenData[](reserves.length);


   for(uint256 i = 0; i < reserves.length; ++i) {
    address bProtocol = pool.getBProtocol(reserves[i]);
    
    if(bProtocol != address(0)) {

      DataTypes.ReserveData memory baseData =
      pool.getReserveData(reserves[i]);

      IERC20Detailed aToken = IERC20Detailed(baseData.aTokenAddress);
      IBAMM bamm = IBAMM(bProtocol);
      (, uint256 collateralValue)= bamm.getCollateralValue();

      IERC20Detailed BAMM = IERC20Detailed(bProtocol);
       uint256 userBalance = 0;

      if(BAMM.totalSupply() > 0) {
        userBalance = (aToken.balanceOf(bProtocol) + collateralValue) * BAMM.balanceOf(user) / BAMM.totalSupply();
      }

      IERC20Detailed reserve = IERC20Detailed(reserves[i]);

      backstopPools[i] = BackstopPoolTokenData({
        backstopAddress: bProtocol,
        symbol: reserve.symbol(),
        tokenAddress: reserves[i],
        totalBalance : aToken.balanceOf(bProtocol),
        userBalance : userBalance
      });
    }
   }

    return backstopPools;
  }
}