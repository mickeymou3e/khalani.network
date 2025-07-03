import { AncillaryFeature, Tokens } from "@/definitions/types";
import { store } from "@/store";
import {
  checkDefiCallResult,
  topUpTxFeeTokenBalance,
  transferFunds,
  TransferFundsDirection,
} from "@/store/ancillary";
import { SelectionAsset } from "@/store/pool";
import { calculateTxSettings } from "@/utils/ancillary";

import { poolCall } from "../store/pool.api";
import { PoolStrategy } from "../store/pool.types";

const executePooling = async (
  strategy: PoolStrategy,
  poolTokenDepositAddress: string,
  selectionList: SelectionAsset[]
) => {
  const tokenIds = selectionList.map(({ assetKey }) => assetKey);
  const amounts = selectionList.map(({ amount }) => String(amount));
  const payload = {
    strategyCode: strategy.code,
    ids: `["${tokenIds.join('","')}"]`,
    amounts: `["${amounts.join('","')}"]`,
    txSettings: calculateTxSettings(AncillaryFeature.Pool, tokenIds.length),
  };

  const poolingResult = await store.dispatch(poolCall(payload));

  if ("error" in poolingResult) throw new Error("Failed to execute pooling");

  await checkDefiCallResult(poolingResult.data.tx_hash, "pooling");

  const transferPayload = {
    asset: Tokens.JLT,
    amount: selectionList
      .reduce((acc, { amount }) => acc + amount, 0)
      .toString(),
    source: strategy.code,
    destination: poolTokenDepositAddress,
    direction: TransferFundsDirection.DefiToCustody,
  };

  const transferResult = await store.dispatch(transferFunds(transferPayload));

  if ("error" in transferResult) throw new Error("Failed to execute pooling");
};

export const pool = async ({
  strategy,
  poolTokenDepositAddress,
  txFeeDepositAddress,
  selectionList,
}: {
  strategy: PoolStrategy;
  poolTokenDepositAddress: string;
  txFeeDepositAddress: string;
  selectionList: SelectionAsset[];
}) => {
  try {
    await topUpTxFeeTokenBalance({ strategy, txFeeDepositAddress });

    await executePooling(strategy, poolTokenDepositAddress, selectionList);
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
};
