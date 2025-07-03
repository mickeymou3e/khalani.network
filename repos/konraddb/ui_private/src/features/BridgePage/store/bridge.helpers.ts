import { ethers } from "ethers";

import { CertificateRegistry } from "@/definitions/config/registry";
import { AncillaryFeature, Tokens } from "@/definitions/types";
import { store } from "@/store";
import {
  checkDefiCallResult,
  encodeEnergyAttributeTokenId,
  PoolStrategy,
  topUpTxFeeTokenBalance,
} from "@/store/ancillary";
import { calculateTxSettings } from "@/utils/ancillary";

import {
  approveOperator,
  bridgeInCall,
  bridgeOutCall,
  checkEligibility,
  getSignature,
} from "./bridge.api";
import { BridgeSelectionAsset, OpenRequestGridRow } from "./bridge.types";

export const executeBridgeIn = async (
  strategyCode: string,
  row: OpenRequestGridRow
) => {
  const signatureResponse = await store.dispatch(getSignature(row.id));

  if ("error" in signatureResponse)
    throw new Error("Failed to obtain signature");

  const signature = signatureResponse.data!;
  const tokenId = encodeEnergyAttributeTokenId(
    signature.certificateId,
    row.registry as CertificateRegistry,
    row.vintage
  );
  const payload = {
    strategyCode,
    tokenId: tokenId.toString(),
    amount: row.amountValue.toString(),
    oracleData: `0x${signature.oracleData}`,
    deadline: signature.deadline.toString(),
    nonce: `0x${signature.nonce}`,
    sig: signature.signature,
    txSettings: calculateTxSettings(AncillaryFeature.BridgeIn),
  };

  const bridgeResponse = await store.dispatch(bridgeInCall(payload));

  if ("error" in bridgeResponse) throw new Error("Failed to execute bridge in");

  await checkDefiCallResult(bridgeResponse.data.tx_hash, "bridge in");

  return bridgeResponse;
};

export const bridgeIn = async (
  strategy: PoolStrategy,
  row: OpenRequestGridRow,
  txFeeDepositAddress: string
) => {
  try {
    await topUpTxFeeTokenBalance({ strategy, txFeeDepositAddress });

    await executeBridgeIn(strategy.code, row);
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
};

const createEligibilityPayload = (
  strategy: PoolStrategy,
  selectionList: BridgeSelectionAsset[]
) => {
  if (!selectionList.length) return null;

  const asset = strategy.assets.find(
    ({ currency }) => currency === Tokens.STRATEGY_JLT_CODE
  );

  return {
    strategyCode: strategy.code,
    methodName: "isApprovedForAll",
    params: {
      operator: process.env.NEXT_PUBLIC_ASSETS_JASMINE_MINTER_ADDRESS as string,
      account: asset?.address ?? "",
    },
  };
};

const createBridgeOutPayload = (
  strategy: PoolStrategy,
  selectionList: BridgeSelectionAsset[]
) => {
  if (!selectionList.length) return null;

  const ids = selectionList.map(({ asset }) => asset);
  const values = selectionList.map(({ amount }) => String(amount));
  const asset = strategy.assets.find(
    ({ currency }) => currency === Tokens.STRATEGY_JLT_CODE
  );

  return {
    strategyCode: strategy.code,
    ids: `["${ids.join('","')}"]`,
    values: `["${values.join('","')}"]`,
    metadata: new ethers.AbiCoder().encode(
      ["bytes1", "address"],
      ["0x10", asset?.address ?? ""]
    ),
    txSettings: calculateTxSettings(AncillaryFeature.BridgeOut, ids.length),
  };
};

const createApprovalPayload = (
  strategy: PoolStrategy,
  selectionList: BridgeSelectionAsset[]
) => {
  const ids = selectionList.map(({ asset }) => asset);

  return {
    strategyCode: strategy.code,
    operator: process.env.NEXT_PUBLIC_ASSETS_JASMINE_MINTER_ADDRESS as string,
    txSettings: calculateTxSettings(AncillaryFeature.BridgeOut, ids.length),
  };
};

const executeBridgeOut = async (
  strategy: PoolStrategy,
  selectionList: BridgeSelectionAsset[]
) => {
  const eligibilityPayload = createEligibilityPayload(strategy, selectionList);

  if (!eligibilityPayload) return;

  const eligibilityResponse = await store.dispatch(
    checkEligibility(eligibilityPayload)
  );

  if ("error" in eligibilityResponse)
    throw new Error("Failed to execute bridge out");

  if (eligibilityResponse.data?.result === "false") {
    const approvalPayload = createApprovalPayload(strategy, selectionList);
    const approvalResponse = await store.dispatch(
      approveOperator(approvalPayload!)
    );

    if ("error" in approvalResponse)
      throw new Error("Failed to execute bridge out");
  }

  const payload = createBridgeOutPayload(strategy, selectionList);

  if (!payload) return;

  const bridgeResponse = await store.dispatch(bridgeOutCall(payload));

  if ("error" in bridgeResponse)
    throw new Error("Failed to execute bridge out");

  await checkDefiCallResult(bridgeResponse.data.tx_hash, "bridge out");

  return bridgeResponse;
};

export const bridgeOut = async ({
  strategy,
  txFeeDepositAddress,
  selectionList,
}: {
  strategy: PoolStrategy;
  txFeeDepositAddress: string;
  selectionList: BridgeSelectionAsset[];
}) => {
  try {
    await topUpTxFeeTokenBalance({ strategy, txFeeDepositAddress });

    await executeBridgeOut(strategy, selectionList);
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
};
