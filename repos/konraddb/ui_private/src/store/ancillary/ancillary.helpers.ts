import { BaseQueryApi } from "@reduxjs/toolkit/dist/query";
import BigNumber from "bignumber.js";

import { Tokens } from "@/definitions/types";
import { store } from "@/store";
import { sleep } from "@/utils/functions";

import {
  ancillaryApi,
  ancillaryJasmineApi,
  checkTransactionStatus,
  getAssetBalances,
  transferFunds,
} from "./ancillary.api";
import {
  BatchHistoryItem,
  PoolHistory,
  PoolStrategy,
  SingleHistoryItem,
  TokenMetadataResponse,
  TransferFundsDirection,
} from "./ancillary.types";
import { decodeEnergyAttributeTokenId } from "./registry.utils";

export const txFeeMinAmount = Number(
  process.env.NEXT_PUBLIC_POOL_TX_FEE_AMOUNT ?? 0
);
export const txFeeMinThreshold = new BigNumber(
  process.env.NEXT_PUBLIC_POOL_TX_FEE_MIN_THRESHOLD ?? 0
);

export const getHistoryTokenIds = (data: PoolHistory) => {
  const singleTokenIds = data.transferSingles.map((entry) => entry.id);
  const batchTokenIds = data.transferBatches.map((entry) => entry.ids).flat();

  return Array.from(new Set([...singleTokenIds, ...batchTokenIds]));
};

export const getTokenMetadata = async (tokenIds: string[], api: BaseQueryApi) =>
  Promise.all(
    tokenIds.map(async (tokenId) => {
      const result = await api.dispatch(
        ancillaryJasmineApi.endpoints.getSingleTokenMetadata.initiate(tokenId)
      );

      return {
        ...result.data,
        tokenId,
        attributes: [
          ...result.data!.attributes,
          {
            trait_type: "Registry",
            value: decodeEnergyAttributeTokenId(tokenId)?.registry ?? "-",
          },
        ],
      } as TokenMetadataResponse;
    })
  );

export const getEligibilityForPooling = async (
  strategyCode: string,
  tokenIds: string[],
  api: BaseQueryApi
) =>
  Promise.all(
    tokenIds.map(async (tokenId) => {
      const result = await api.dispatch(
        ancillaryApi.endpoints.checkEligibility.initiate({
          strategyCode,
          tokenId,
        })
      );

      return { tokenId, eligible: result.data?.result === "true" };
    })
  );

export const addMetadataToHistory = (
  data: PoolHistory,
  metadata: TokenMetadataResponse[]
) => {
  const findMetadata = (tokenId: string) =>
    metadata.find(({ tokenId: id }) => id === tokenId);

  const transferSingles = data.transferSingles.map(
    (entry) =>
      ({ ...entry, metadata: findMetadata(entry.id) } as SingleHistoryItem)
  );
  const transferBatches = data.transferBatches.map(
    (entry) =>
      ({
        ...entry,
        metadata: entry.ids.map(findMetadata),
      } as BatchHistoryItem)
  );

  return {
    transferSingles,
    transferBatches,
  };
};

export const getBalances = async (strategyCode: string) => {
  const balancesResult = await store.dispatch(getAssetBalances(strategyCode));
  const { balances } = balancesResult.data!;
  const txFeeBalance = balances.find(
    ({ currency }) => currency === Tokens.STRATEGY_MATIC
  )!;
  const poolTokenBalance = balances.find(
    ({ currency }) => currency === Tokens.STRATEGY_JLT_CODE
  )!;

  return {
    txFeeBalance: new BigNumber(txFeeBalance.balance),
    poolTokenBalance: new BigNumber(poolTokenBalance.balance),
  };
};

export const topUpTxFeeTokenBalance = async ({
  strategy,
  txFeeDepositAddress,
}: {
  strategy: PoolStrategy;
  txFeeDepositAddress: string;
}) => {
  const { txFeeBalance } = await getBalances(strategy.code);

  if (txFeeBalance.lt(txFeeMinThreshold)) {
    const payload = {
      asset: Tokens.MATIC,
      amount: txFeeMinAmount.toString(),
      source: txFeeDepositAddress,
      destination: strategy.code,
      direction: TransferFundsDirection.CustodyToDefi,
    };

    const txFeeDepositResult = await store.dispatch(transferFunds(payload));

    if ("error" in txFeeDepositResult)
      throw new Error("Failed to top-up tx fee");
  }
};

const checkTopUpBalancesResult = async (
  strategy: PoolStrategy,
  balanceRequirement: BigNumber
) => {
  const { txFeeBalance, poolTokenBalance } = await getBalances(strategy.code);
  const isTxFeeBalanceInsufficient = txFeeBalance.lt(txFeeMinThreshold);
  const isPoolTokenBalanceInsufficient =
    poolTokenBalance.lt(balanceRequirement);

  if (isTxFeeBalanceInsufficient || isPoolTokenBalanceInsufficient) {
    await sleep(3000);
    await checkTopUpBalancesResult(strategy, balanceRequirement);
  }

  return true;
};

export const topUpDefiBalances = async ({
  strategy,
  poolTokenDepositAddress,
  txFeeDepositAddress,
  selectionList,
}: {
  strategy: PoolStrategy;
  poolTokenDepositAddress: string;
  txFeeDepositAddress: string;
  selectionList: { amount: number }[];
}) => {
  await topUpTxFeeTokenBalance({ strategy, txFeeDepositAddress });

  const { poolTokenBalance } = await getBalances(strategy.code);
  const sumPoolTokenAmount = selectionList.reduce(
    (acc, { amount }) => acc.plus(amount),
    new BigNumber(0)
  );

  if (poolTokenBalance < sumPoolTokenAmount) {
    const amount = sumPoolTokenAmount.minus(poolTokenBalance);
    const payload = {
      asset: Tokens.JLT,
      amount: amount.toFixed(),
      source: poolTokenDepositAddress,
      destination: strategy.code,
      direction: TransferFundsDirection.CustodyToDefi,
    };

    const poolTokenDepositResult = await store.dispatch(transferFunds(payload));

    if ("error" in poolTokenDepositResult)
      throw new Error("Failed to top-up pool token balance");

    await checkTopUpBalancesResult(strategy, sumPoolTokenAmount);
  }
};

export const checkDefiCallResult = async (
  txHash: string,
  operation: string,
  count = 3
) => {
  const result = await store.dispatch(checkTransactionStatus(txHash));

  if ("error" in result) {
    if (count === 1) throw new Error(`Failed to execute ${operation}`);

    await sleep(3000);
    await checkDefiCallResult(txHash, operation, count - 1);
  }

  if (!result.data?.status) throw new Error(`Failed to execute ${operation}`);

  return true;
};
