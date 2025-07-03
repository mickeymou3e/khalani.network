import { createSelector } from "@reduxjs/toolkit";

import { StrategyNames } from "@/definitions/config";
import { Tokens } from "@/definitions/types";
import { selectRawCryptoDepositAddresses } from "@/store/wallet";
import { formatValue } from "@/utils/formatters";

import {
  selectJasminePoolDeposits,
  selectPoolStrategies,
  selectStrategyAssets,
} from "./ancillary.api";
import {
  Attribute,
  EnergyAttributeTokenProps,
  TokenMetadataAttributes,
} from "./ancillary.types";

export const findAttribute = (
  attributes: TokenMetadataAttributes[],
  trait: Attribute
) => attributes?.find((item) => item.trait_type === trait)?.value ?? "";

export const selectPoolDeposits = createSelector(
  selectJasminePoolDeposits,
  (poolDeposits = []) =>
    poolDeposits?.map((token) => ({
      id: token.tokenId,
      generator: findAttribute(token.metadata.attributes, Attribute.Generator),
      vintage: findAttribute(token.metadata.attributes, Attribute.Vintage),
      region: findAttribute(token.metadata.attributes, Attribute.Region),
      techType: findAttribute(token.metadata.attributes, Attribute.TechType),
      registry: findAttribute(token.metadata.attributes, Attribute.Registry),
      balance: formatValue(token.balance),
      balanceValue: token.balance,
      icon: "jasmine",
    }))
);

export const selectEnergyAttributeTokens = createSelector(
  [selectStrategyAssets],
  (strategyAssets = []) =>
    strategyAssets
      ?.filter((asset) => Boolean(asset.meta))
      .map((asset) => {
        const assetMeta = asset.meta!;
        const assetBalance = Number(asset.balance);

        return {
          id: assetMeta.tokenId,
          generator: findAttribute(assetMeta.attributes, Attribute.Generator),
          vintage: findAttribute(assetMeta.attributes, Attribute.Vintage),
          region: findAttribute(assetMeta.attributes, Attribute.Region),
          techType: findAttribute(assetMeta.attributes, Attribute.TechType),
          registry: findAttribute(assetMeta.attributes, Attribute.Registry),
          balance: formatValue(assetBalance),
          balanceValue: assetBalance,
          strategyBalance: formatValue(assetBalance),
          strategyBalanceValue: assetBalance,
          eligibleForPooling: asset.eligibleForPooling,
          icon: "jasmine",
        };
      }) as EnergyAttributeTokenProps[]
);

export const seelctSortedEnergyAttributeTokens = createSelector(
  selectEnergyAttributeTokens,
  (energyAttributeTokens) =>
    energyAttributeTokens.sort((a, b) =>
      a.balanceValue < b.balanceValue ? 1 : -1
    )
);

export const selectIsEnergyAttributeTokensEmpty = createSelector(
  selectEnergyAttributeTokens,
  (energyAttributeTokens) => !energyAttributeTokens.length
);

export const selectStrategy = createSelector(
  selectPoolStrategies,
  (strategies) => {
    const strategy = strategies.find(
      (strategy) => strategy.name === StrategyNames.Jasmine
    );

    return strategy!;
  }
);

export const selectJltTokenAddress = createSelector(
  selectStrategy,
  (strategy) => {
    const asset = strategy?.assets.find(
      (asset) => asset.currency === Tokens.STRATEGY_JLT_CODE
    );

    return asset?.address ?? "";
  }
);

export const selectSelectedStrategyCode = createSelector(
  selectStrategy,
  (strategy) => strategy?.code
);

export const selectPoolTokenDepositAddress = createSelector(
  selectRawCryptoDepositAddresses,
  (cryptoDepositAddresses) => {
    const filteredElement = cryptoDepositAddresses.find(
      (item) => item.currency_code === Tokens.JLT
    );

    return filteredElement?.code ?? "";
  }
);

export const selectTxFeeDepositAddress = createSelector(
  selectRawCryptoDepositAddresses,
  (cryptoDepositAddresses) => {
    const filteredElement = cryptoDepositAddresses.find(
      (item) => item.currency_code === Tokens.MATIC
    );

    return filteredElement?.code ?? "";
  }
);
