import { AncillaryFeature } from "@/definitions/types";
import { store } from "@/store";
import { checkDefiCallResult, topUpDefiBalances } from "@/store/ancillary";
import { SelectionAsset } from "@/store/pool";
import { calculateTxSettings } from "@/utils/ancillary";

import { redeemCall } from "../store/pool.api";
import { PoolStrategy } from "../store/pool.types";

const executeRedeem = async (
  strategy: PoolStrategy,
  selectionList: SelectionAsset[]
) => {
  const tokenIds = selectionList.map(({ assetKey }) => assetKey);
  const amounts = selectionList.map(({ amount }) => String(amount));
  const payload = {
    strategyCode: strategy.code,
    tokenIds: `["${tokenIds.join('","')}"]`,
    amounts: `["${amounts.join('","')}"]`,
    txSettings: calculateTxSettings(AncillaryFeature.Redeem, tokenIds.length),
  };

  const redeemResult = await store.dispatch(redeemCall(payload));

  if ("error" in redeemResult) throw new Error("Failed to execute redeem");

  await checkDefiCallResult(redeemResult.data.tx_hash, "redeem");
};

export const redeem = async ({
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
    await topUpDefiBalances({
      strategy,
      poolTokenDepositAddress,
      txFeeDepositAddress,
      selectionList,
    });

    await executeRedeem(strategy, selectionList);
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
};
