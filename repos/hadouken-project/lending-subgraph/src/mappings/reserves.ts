import * as Schemas from "../../generated/schema";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  CollateralConfigurationChanged,
  BorrowingEnabledOnReserve,
  ReserveFactorChanged,
  ReserveInitialized,
  BorrowingDisabledOnReserve,
  ReserveActivated,
  ReserveDeactivated,
  ReserveDecimalsChanged,
  ReserveFrozen,
  ReserveInterestRateStrategyChanged,
  ReserveUnfrozen,
  StableRateDisabledOnReserve,
  StableRateEnabledOnReserve,
  DepositCapChanged,
  BorrowCapChanged,
} from "../../generated/LendingPool/LendingPoolConfigurator";
import { ERC20 } from "../../generated/Reserves/ERC20";
import { createOrLoadRegistry } from "./lendingPoolAddressesProvider";

// tokenType
// 0 -> Default token
// 1 -> AToken
// 2 -> StableDebt token
// 3 -> VariableDebt token

export function LoadReserve(address: Address): Schemas.Reserve | null {
  let id = address.toHexString();
  let reserve = Schemas.Reserve.load(id);

  if (reserve) {
    return reserve;
  }

  return null;
}

export function createOrLoadPoolToken(
  address: Address,
  underlyingAssetAddress: Bytes,
  tokenType: BigInt
): Schemas.PoolToken {
  let id = address.toHexString();
  let token = Schemas.PoolToken.load(id);

  if (!token) {
    token = new Schemas.PoolToken(id);

    let erc = ERC20.bind(address);
    let decimals = erc.try_decimals();
    let symbol = erc.try_symbol();

    token.symbol = symbol.reverted ? "unknown" : symbol.value;
    token.decimals = decimals.reverted
      ? BigInt.fromI32(0)
      : BigInt.fromI32(decimals.value);
    token.address = address;
    token.isAToken = tokenType.equals(BigInt.fromI32(1));
    token.isStableDebt = tokenType.equals(BigInt.fromI32(2));
    token.isVariableDebt = tokenType.equals(BigInt.fromI32(3));
    token.underlyingAsset = underlyingAssetAddress;
    token.save();
  }

  return token as Schemas.PoolToken;
}

export function createOrLoadReserve(
  reserveAddress: Address,
  aTokenAddress: Address,
  stableDebtTokenAddress: Address,
  variableDebtTokenAddress: Address,
  interestRateStrategyAddress: Address
): Schemas.Reserve {
  let reserve = LoadReserve(reserveAddress);

  if (!reserve) {
    reserve = new Schemas.Reserve(reserveAddress.toHexString());

    let erc = ERC20.bind(reserveAddress);
    let decimals = erc.try_decimals();
    let symbol = erc.try_symbol();

    reserve.symbol = symbol.reverted ? "unknown" : symbol.value;
    reserve.decimals = decimals.reverted
      ? BigInt.fromI32(0)
      : BigInt.fromI32(decimals.value);

    reserve.availableLiquidity = BigInt.fromI32(0);
    reserve.totalVariableDebt = BigInt.fromI32(0);
    reserve.totalStableDebt = BigInt.fromI32(0);
    reserve.depositCap = BigInt.fromI32(0);
    reserve.borrowCap = BigInt.fromI32(0);
    reserve.isActive = true;
    reserve.isFrozen = false;
    reserve.address = reserveAddress;
    reserve.aTokenAddress = aTokenAddress;
    reserve.variableDebtTokenAddress = variableDebtTokenAddress;
    reserve.stableDebtTokenAddress = stableDebtTokenAddress;
    reserve.interestRateStrategyAddress = interestRateStrategyAddress;
    reserve.variableBorrowIndex = BigInt.fromI32(0);
    reserve.liquidityIndex = BigInt.fromI32(0);
    reserve.totalLiquidity = BigInt.fromI32(0);
    reserve.ltv = BigInt.fromI32(0);
    reserve.liquidityThreshold = BigInt.fromI32(0);
    reserve.liquidityBonus = BigInt.fromI32(0);
    reserve.isBorrowingEnable = true;
    reserve.isStableBorrowingEnable = false;
    reserve.liquidityRate = BigInt.fromI32(0);
    reserve.variableBorrowRate = BigInt.fromI32(0);
    reserve.stableBorrowRate = BigInt.fromI32(0);

    createOrLoadPoolToken(reserveAddress, reserveAddress, BigInt.fromI32(0));
    createOrLoadPoolToken(aTokenAddress, reserveAddress, BigInt.fromI32(1));
    createOrLoadPoolToken(
      stableDebtTokenAddress,
      reserveAddress,
      BigInt.fromI32(2)
    );
    createOrLoadPoolToken(
      variableDebtTokenAddress,
      reserveAddress,
      BigInt.fromI32(3)
    );

    reserve.save();

    let registry = createOrLoadRegistry();

    let currentReserves = registry.reserves;
    let reserves: string[] = [];

    if (currentReserves && currentReserves.length > 0) {
      reserves = currentReserves;
    }
    reserves.push(reserveAddress.toHexString());
    registry.reserves = reserves;
    registry.save();
  }

  return reserve as Schemas.Reserve;
}

export function CollateralConfigurationChangedHandler(
  event: CollateralConfigurationChanged
): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.ltv = event.params.ltv;
    reserve.liquidityThreshold = event.params.liquidationThreshold;
    reserve.liquidityBonus = event.params.liquidationBonus;

    reserve.save();
  }
}

export function BorrowingEnabledOnReserveHandler(
  event: BorrowingEnabledOnReserve
): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.isBorrowingEnable = event.params.stableRateEnabled;

    reserve.save();
  }
}

export function ReserveFactorChangedHandler(event: ReserveFactorChanged): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.reservedFactory = event.params.factor;

    reserve.save();
  }
}

export function BorrowingDisabledOnReserveHandler(
  event: BorrowingDisabledOnReserve
): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.isBorrowingEnable = false;

    reserve.save();
  }
}

export function ReserveActivatedHandler(event: ReserveActivated): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.isActive = true;

    reserve.save();
  }
}

export function ReserveDeactivatedHandler(event: ReserveDeactivated): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.isActive = false;

    reserve.save();
  }
}

export function ReserveDecimalsChangedHandler(
  event: ReserveDecimalsChanged
): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.decimals = event.params.decimals;

    reserve.save();
  }
}

export function ReserveFrozenHandler(event: ReserveFrozen): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.isFrozen = true;

    reserve.save();
  }
}

export function ReserveInterestRateStrategyChangedHandler(
  event: ReserveInterestRateStrategyChanged
): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.interestRateStrategyAddress = event.params.strategy;

    reserve.save();
  }
}

export function ReserveUnfrozenHandler(event: ReserveUnfrozen): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.isFrozen = false;

    reserve.save();
  }
}

export function StableRateDisabledOnReserveHandler(
  event: StableRateDisabledOnReserve
): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.isStableBorrowingEnable = false;

    reserve.save();
  }
}

export function StableRateEnabledOnReserveHandler(
  event: StableRateEnabledOnReserve
): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.isStableBorrowingEnable = true;

    reserve.save();
  }
}

export function ReserveInitializedHandler(event: ReserveInitialized): void {
  createOrLoadReserve(
    event.params.asset,
    event.params.aToken,
    event.params.stableDebtToken,
    event.params.variableDebtToken,
    event.params.interestRateStrategyAddress
  );
}

export function DepositCapChangedHandler(event: DepositCapChanged): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.depositCap = event.params.depositCap;

    reserve.save();
  }
}

export function BorrowCapChangedHandler(event: BorrowCapChanged): void {
  let reserve = LoadReserve(event.params.asset);

  if (reserve) {
    reserve.borrowCap = event.params.borrowCap;

    reserve.save();
  }
}
