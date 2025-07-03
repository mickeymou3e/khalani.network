import {
  Borrow,
  LendingPool,
  Repay,
  Withdraw,
  Swap,
  ReserveUsedAsCollateralEnabled,
  ReserveUsedAsCollateralDisabled,
  LiquidationCall,
} from "../../generated/LendingPool/LendingPool";
import { Deposit } from "../../generated//LendingPool/LendingPool";
import * as Schemas from "../../generated/schema";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";

import { IERC20Detailed } from "../../generated/LendingPool/IERC20Detailed";
import { LoadReserve } from "./reserves";
import { getOrInitAToken } from "./tokens";

export function updateReserveAmounts(
  reserveAddress: Address,
  poolAddress: Address,
  txHash: string
): void {
  let pool = LendingPool.bind(poolAddress);
  let reserves = pool.try_getReserveData(reserveAddress);

  if (reserves.reverted) {
    return;
  }
  let reserve = LoadReserve(reserveAddress);
  if (reserve) {
    let ercContract = IERC20Detailed.bind(reserveAddress);
    let balance = ercContract.try_balanceOf(
      Address.fromString(reserve.aTokenAddress.toHexString())
    );

    if (!balance.reverted) {
      reserve.availableLiquidity = balance.value;
    }

    let stableDebtTokenContract = IERC20Detailed.bind(
      Address.fromString(reserve.stableDebtTokenAddress.toHexString())
    );

    let stableDebtTotalSupply = stableDebtTokenContract.try_totalSupply();
    if (!stableDebtTotalSupply.reverted) {
      reserve.totalStableDebt = stableDebtTotalSupply.value;
    }

    let variableDebtTokenContract = IERC20Detailed.bind(
      Address.fromString(reserve.variableDebtTokenAddress.toHexString())
    );

    let variableDebtTotalSupply = variableDebtTokenContract.try_totalSupply();
    if (!variableDebtTotalSupply.reverted) {
      reserve.totalVariableDebt = variableDebtTotalSupply.value;
    }

    reserve.liquidityRate = reserves.value.currentLiquidityRate;
    reserve.variableBorrowRate = reserves.value.currentVariableBorrowRate;
    reserve.stableBorrowRate = reserves.value.currentStableBorrowRate;
    reserve.liquidityIndex = reserves.value.liquidityIndex;
    reserve.variableBorrowIndex = reserves.value.variableBorrowIndex;
    reserve.lastUpdateTimestamp = reserves.value.lastUpdateTimestamp;
    reserve.save();

    saveReserveHistory(
      txHash,
      reserve.address,
      reserves.value.currentLiquidityRate,
      reserves.value.currentStableBorrowRate,
      reserves.value.currentVariableBorrowRate,
      reserves.value.liquidityIndex,
      reserves.value.variableBorrowIndex,
      reserves.value.lastUpdateTimestamp
    );
  }
}

export function saveReserveHistory(
  txHash: string,
  reserve: Bytes,
  liquidityRate: BigInt,
  stableBorrowRate: BigInt,
  variableBorrowRate: BigInt,
  liquidityIndex: BigInt,
  variableBorrowIndex: BigInt,
  lastUpdateTimestamp: BigInt
): void {
  let reserveHistory = new Schemas.ReserveHistory(
    txHash + reserve.toHexString()
  );

  reserveHistory.reserve = reserve;
  reserveHistory.liquidityRate = liquidityRate;
  reserveHistory.stableBorrowRate = stableBorrowRate;
  reserveHistory.variableBorrowRate = variableBorrowRate;
  reserveHistory.liquidityIndex = liquidityIndex;
  reserveHistory.variableBorrowIndex = variableBorrowIndex;
  reserveHistory.lastUpdateTimestamp = lastUpdateTimestamp;

  reserveHistory.save();
}

export function updateUserData(
  userAddress: Address,
  poolAddress: Address
): void {
  let user = Schemas.User.load(userAddress.toHexString());

  if (!user) {
    user = new Schemas.User(userAddress.toHexString());
    user.currentLiquidationThreshold = BigInt.fromI32(0);
    user.ltv = BigInt.fromI32(0);
    user.save();
  }

  let poolContract = LendingPool.bind(poolAddress);
  let accountData = poolContract.try_getUserAccountData(userAddress);

  if (accountData.reverted) {
    log.warning("account data missing", []);
  } else {
    user.currentLiquidationThreshold = accountData.value.value3;
    user.ltv = accountData.value.value4;

    user.save();
  }
}

export function depositToPoolHandler(event: Deposit): void {
  let poolAddress = event.address;
  let reserveAddress = event.params.reserve;

  updateUserData(event.params.onBehalfOf, poolAddress);
  updateReserveAmounts(
    reserveAddress,
    poolAddress,
    event.transaction.hash.toHexString()
  );
}

export function withdrawFromPoolHandler(event: Withdraw): void {
  let poolAddress = event.address;
  let reserveAddress = event.params.reserve;

  updateUserData(event.params.user, poolAddress);
  updateReserveAmounts(
    reserveAddress,
    poolAddress,
    event.transaction.hash.toHexString()
  );
}

export function borrowFromPoolHandler(event: Borrow): void {
  let poolAddress = event.address;
  let reserveAddress = event.params.reserve;

  updateUserData(event.params.onBehalfOf, poolAddress);
  updateReserveAmounts(
    reserveAddress,
    poolAddress,
    event.transaction.hash.toHexString()
  );
}

export function repayFromPoolHandler(event: Repay): void {
  let poolAddress = event.address;
  let reserveAddress = event.params.reserve;

  updateUserData(event.params.user, poolAddress);
  updateReserveAmounts(
    reserveAddress,
    poolAddress,
    event.transaction.hash.toHexString()
  );
}

export function swapBorrowMode(event: Swap): void {
  let poolAddress = event.address;
  let reserveAddress = event.params.reserve;

  updateUserData(event.params.user, poolAddress);
  updateReserveAmounts(
    reserveAddress,
    poolAddress,
    event.transaction.hash.toHexString()
  );
}

export function liquidationCall(event: LiquidationCall): void {
  let poolAddress = event.address;
  let params = event.params;
  let collateralAsset = LoadReserve(params.collateralAsset);

  if (collateralAsset) {
    updateReserveAmounts(
      params.collateralAsset,
      poolAddress,
      event.transaction.hash.toHexString()
    );
  }
  let debtAsset = LoadReserve(params.debtAsset);
  if (debtAsset) {
    updateReserveAmounts(
      params.debtAsset,
      poolAddress,
      event.transaction.hash.toHexString()
    );
  }

  let user = Schemas.User.load(params.user.toHexString());
  if (user) {
    let liquidation = new Schemas.Liquidation(
      params.user.toHexString() +
        params.liquidator.toHexString() +
        event.block.timestamp.toString()
    );
    liquidation.collateralAsset = params.collateralAsset;
    liquidation.debtAsset = params.debtAsset;
    liquidation.user = user.id;
    liquidation.debtToCover = params.debtToCover;
    liquidation.liquidatedCollateralAmount = params.liquidatedCollateralAmount;
    liquidation.liquidator = params.liquidator;
    liquidation.receiveAToken = params.receiveAToken;
    liquidation.save();
  }

  updateUserData(event.params.user, poolAddress);
  updateUserData(event.params.liquidator, poolAddress);
}

export function setAssetAsCollateralEnabled(
  event: ReserveUsedAsCollateralEnabled
): void {
  let reserve = Schemas.Reserve.load(event.params.reserve.toHexString());
  if (reserve) {
    let aTokenBalance = getOrInitAToken(
      event.params.user,
      Address.fromBytes(reserve.aTokenAddress)
    );
    aTokenBalance.isCollateral = true;
    aTokenBalance.save();
  }
  let poolAddress = event.address;

  updateUserData(event.params.user, poolAddress);
}

export function setAssetAsCollateralDisabled(
  event: ReserveUsedAsCollateralDisabled
): void {
  let reserve = Schemas.Reserve.load(event.params.reserve.toHexString());

  if (reserve) {
    let aTokenBalance = getOrInitAToken(
      event.params.user,
      Address.fromBytes(reserve.aTokenAddress)
    );
    aTokenBalance.isCollateral = false;
    aTokenBalance.save();
  }
  let poolAddress = event.address;

  updateUserData(event.params.user, poolAddress);
}
