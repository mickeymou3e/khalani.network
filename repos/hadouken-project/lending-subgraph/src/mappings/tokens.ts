import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { zeroAddress } from "../constants";
import {
  BalanceTransfer as ATokenTransfer,
  Mint as ATokenMint,
  Burn as ATokenBurn,
} from "../../generated/AToken/AToken";
import {
  Mint as STokenMint,
  Burn as STokenBurn,
} from "../../generated/StableDebtToken/StableDebtToken";
import {
  Mint as VTokenMint,
  Burn as VTokenBurn,
} from "../../generated/VariableDebtToken/VariableDebtToken";
import {
  ATokenAsset,
  STokenAsset,
  VTokenAsset,
  PoolToken,
  User,
} from "../../generated/schema";
import { rayDiv, rayMul } from "../utils/math";

import { LoadReserve } from "./reserves";

export function getOrInitAToken(
  walletAddress: Address,
  tokenAddress: Address
): ATokenAsset {
  let id = walletAddress.toHexString() + tokenAddress.toHexString();
  let tokenBalance = ATokenAsset.load(id);
  let poolToken = PoolToken.load(tokenAddress.toHexString());

  if (!tokenBalance) {
    tokenBalance = new ATokenAsset(id);
    tokenBalance.scaledBalance = BigInt.fromI32(0);
    tokenBalance.currentBalance = BigInt.fromI32(0);
    tokenBalance.isCollateral = true;
    tokenBalance.walletAddress = walletAddress;
    tokenBalance.address = tokenAddress;
    tokenBalance.underlyingAsset = zeroAddress();

    if (poolToken) {
      let reserve = LoadReserve(Address.fromBytes(poolToken.underlyingAsset));

      if (reserve) {
        tokenBalance.underlyingAsset = reserve.address;
        if (reserve.ltv.isZero()) {
          tokenBalance.isCollateral = false;
        }
      }
    }
  }

  return tokenBalance;
}

function updateUserATokenBalance(
  userAddress: Bytes,
  tokenBalance: ATokenAsset
): void {
  let user = User.load(userAddress.toHexString());

  if (user) {
    let aTokenAssets = user.aTokenAssets;
    if (aTokenAssets) {
      aTokenAssets.push(tokenBalance.id);
    } else {
      aTokenAssets = [tokenBalance.id];
    }

    user.aTokenAssets = aTokenAssets;

    user.save();
  }
}

export function handleATokenBurn(event: ATokenBurn): void {
  let calculatedAmount = event.params.value;

  let token = getOrInitAToken(event.params.from, event.address);

  token.scaledBalance = token.scaledBalance.minus(calculatedAmount);
  token.currentBalance = rayMul(token.scaledBalance, event.params.index);

  updateUserATokenBalance(event.params.from, token);
  token.save();
}

export function handleATokenTransfer(event: ATokenTransfer): void {
  let calculatedAmount = rayDiv(event.params.value, event.params.index); // this value is emitted without typical amount.rayDiv(index)

  let tokenFrom = getOrInitAToken(event.params.from, event.address);
  tokenFrom.scaledBalance = tokenFrom.scaledBalance.minus(calculatedAmount);
  tokenFrom.currentBalance = rayMul(
    tokenFrom.scaledBalance,
    event.params.index
  );

  let tokenTo = getOrInitAToken(event.params.to, event.address);
  tokenTo.scaledBalance = tokenTo.scaledBalance.plus(calculatedAmount);
  tokenTo.currentBalance = rayMul(tokenTo.scaledBalance, event.params.index);

  updateUserATokenBalance(event.params.from, tokenFrom);
  updateUserATokenBalance(event.params.to, tokenTo);
  tokenFrom.save();
  tokenTo.save();
}

export function handleATokenMint(event: ATokenMint): void {
  let calculatedAmount = event.params.value;

  let token = getOrInitAToken(event.params.from, event.address);
  token.scaledBalance = token.scaledBalance.plus(calculatedAmount);
  token.currentBalance = rayMul(token.scaledBalance, event.params.index);

  updateUserATokenBalance(event.params.from, token);
  token.save();
}

export function getOrInitSToken(
  walletAddress: Address,
  tokenAddress: Address
): STokenAsset {
  let id = walletAddress.toHexString() + tokenAddress.toHexString();
  let token = STokenAsset.load(id);
  let sToken = PoolToken.load(tokenAddress.toHexString());

  if (!token) {
    token = new STokenAsset(id);
    token.principalStableDebt = BigInt.fromI32(0);
    token.currentStableDebt = BigInt.fromI32(0);
    token.walletAddress = walletAddress;
    token.address = tokenAddress;
    token.underlyingAsset = zeroAddress();
    if (sToken) {
      let reserve = LoadReserve(Address.fromBytes(sToken.underlyingAsset));
      if (reserve) {
        token.underlyingAsset = reserve.address;
      }
    }
  }
  return token;
}

function updateUserSTokenBalance(
  userAddress: Bytes,
  tokenBalance: STokenAsset
): void {
  let user = User.load(userAddress.toHexString());

  if (user) {
    let sTokenAssets = user.stableBorrowAssets;
    if (sTokenAssets) {
      sTokenAssets.push(tokenBalance.id);
    } else {
      sTokenAssets = [tokenBalance.id];
    }

    user.stableBorrowAssets = sTokenAssets;
    user.save();
  }
}

export function handleStableTokenBurn(event: STokenBurn): void {
  let token = getOrInitSToken(event.params.user, event.address);
  token.principalStableDebt = token.principalStableDebt.minus(
    event.params.amount
  );
  token.currentStableDebt = token.principalStableDebt;
  updateUserSTokenBalance(event.params.user, token);
  token.save();
}

export function handleStableTokenMint(event: STokenMint): void {
  let calculatedAmount = event.params.amount.plus(event.params.balanceIncrease);

  let token = getOrInitSToken(event.params.user, event.address);
  token.principalStableDebt = token.principalStableDebt.plus(calculatedAmount);
  token.currentStableDebt = token.principalStableDebt;
  updateUserSTokenBalance(event.params.user, token);
  token.save();
}

export function getOrInitVToken(
  walletAddress: Address,
  tokenAddress: Address
): VTokenAsset {
  let id = walletAddress.toHexString() + tokenAddress.toHexString();
  let token = VTokenAsset.load(id);
  let vToken = PoolToken.load(tokenAddress.toHexString());
  if (!token) {
    token = new VTokenAsset(id);
    token.scaledVariableDebt = BigInt.fromI32(0);
    token.currentVariableDebt = BigInt.fromI32(0);
    token.walletAddress = walletAddress;
    token.address = tokenAddress;
    token.underlyingAsset = zeroAddress();
    if (vToken) {
      let reserve = LoadReserve(Address.fromBytes(vToken.underlyingAsset));
      if (reserve) {
        token.underlyingAsset = reserve.address;
      }
    }
  }
  return token;
}

function updateUserVTokenBalance(
  userAddress: Bytes,
  tokenBalance: VTokenAsset
): void {
  let user = User.load(userAddress.toHexString());

  if (user) {
    let vTokenAssets = user.variableBorrowAssets;
    if (vTokenAssets) {
      vTokenAssets.push(tokenBalance.id);
    } else {
      vTokenAssets = [tokenBalance.id];
    }

    user.variableBorrowAssets = vTokenAssets;
    user.save();
  }
}

export function handleVariableTokenBurn(event: VTokenBurn): void {
  let calculatedAmount = event.params.amount;

  let token = getOrInitVToken(event.params.user, event.address);
  token.scaledVariableDebt = token.scaledVariableDebt.minus(calculatedAmount);
  token.currentVariableDebt = rayMul(
    token.scaledVariableDebt,
    event.params.index
  );
  updateUserVTokenBalance(event.params.user, token);
  token.save();
}

export function handleVariableTokenMint(event: VTokenMint): void {
  let calculatedAmount = event.params.value;

  let token = getOrInitVToken(event.params.from, event.address);
  token.scaledVariableDebt = token.scaledVariableDebt.plus(calculatedAmount);
  token.currentVariableDebt = rayMul(
    token.scaledVariableDebt,
    event.params.index
  );
  updateUserVTokenBalance(event.params.from, token);
  token.save();
}
