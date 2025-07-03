import BigNumber from "bignumber.js";

import { areAssetsEqual, AssetConfig } from "@/definitions/config";
import { AncillaryFeature, Tokens } from "@/definitions/types";
import { store } from "@/store";
import {
  checkDefiCallResult,
  PoolStrategy,
  topUpDefiBalances,
} from "@/store/ancillary";
import { calculateTxSettings } from "@/utils/ancillary";

import {
  confirmRetireAction,
  retireEnergyAttributeTokensCall,
  retirePoolTokenCall,
} from "./retire.api";
import {
  RetireConfirmParams,
  RetirementType,
  RetireSelectionAsset,
} from "./retire.types";

type SecondStepProps = {
  amount: number;
  retirementType: string;
};

export const createRetireEnergyAttributeTokensPayload = (
  strategy: PoolStrategy,
  selectionList: RetireSelectionAsset[]
) => {
  const energyAttributeTokensSelection = selectionList.filter(
    ({ asset }) => asset.toLowerCase() !== Tokens.JLT.toLowerCase()
  );

  if (!energyAttributeTokensSelection.length) return null;

  const ids = energyAttributeTokensSelection.map(({ asset }) => asset);
  const values = energyAttributeTokensSelection.map(({ amount }) =>
    String(amount)
  );
  const sumValues = energyAttributeTokensSelection.reduce(
    (sum, { amount }) => sum + amount,
    0
  );

  return {
    firstStep: {
      strategyCode: strategy.code,
      ids: `["${ids.join('","')}"]`,
      values: `["${values.join('","')}"]`,
      txSettings: calculateTxSettings(AncillaryFeature.Retire, ids.length),
    },
    secondStep: {
      amount: sumValues,
      retirementType: RetirementType.EAT,
    },
  };
};

export const createRetirePoolTokenPayload = (
  strategy: PoolStrategy,
  selectionList: RetireSelectionAsset[]
) => {
  const poolTokenSelection = selectionList.filter(
    ({ asset }) => asset.toLowerCase() === Tokens.JLT.toLowerCase()
  );

  if (!poolTokenSelection.length) return null;

  const poolToken = process.env.NEXT_PUBLIC_POOL_TOKEN as string;

  const sumValues = poolTokenSelection.reduce(
    (sum, { amount }) => sum.plus(amount),
    new BigNumber(0)
  );
  const realValue = sumValues.multipliedBy(
    10 ** AssetConfig[poolToken].priceDecimals
  );

  return {
    firstStep: {
      strategyCode: strategy.code,
      amount: realValue.toFixed(),
      txSettings: calculateTxSettings(AncillaryFeature.RetirePool),
    },
    secondStep: {
      amount: sumValues.toNumber(),
      retirementType: RetirementType.JLT,
    },
  };
};

const executeSecondStep = async (
  secondStep: SecondStepProps,
  txHash: string,
  formValues: RetireConfirmParams
) => {
  const retireConfirmPayload = {
    quantity: secondStep.amount,
    transactionHash: txHash,
    reason: formValues.reason,
    beneficiary: formValues.beneficiary,
    auditRequested: formValues.eAudit,
    auditYear: parseFloat(formValues.auditYear),
    retirementType: secondStep.retirementType,
  };

  const retireConfirmResult = await store.dispatch(
    confirmRetireAction(retireConfirmPayload)
  );

  if ("error" in retireConfirmResult)
    throw new Error("Failed to execute retire second step");
};

const executeRetireEnergyAttributeTokens = async (
  strategy: PoolStrategy,
  selectionList: RetireSelectionAsset[],
  formValues: RetireConfirmParams
) => {
  const retireEnergyAttributeTokensPayload =
    createRetireEnergyAttributeTokensPayload(strategy, selectionList);

  if (!retireEnergyAttributeTokensPayload) return;

  const retireResult = await store.dispatch(
    retireEnergyAttributeTokensCall(
      retireEnergyAttributeTokensPayload.firstStep
    )
  );

  if ("error" in retireResult)
    throw new Error("Failed to execute retire first step");

  await checkDefiCallResult(retireResult.data.tx_hash, "retire first step");

  await executeSecondStep(
    retireEnergyAttributeTokensPayload.secondStep,
    retireResult.data!.tx_hash,
    formValues
  );
};

const executeRetirePoolToken = async (
  strategy: PoolStrategy,
  selectionList: RetireSelectionAsset[],
  formValues: RetireConfirmParams
) => {
  const retirePoolTokenPayload = createRetirePoolTokenPayload(
    strategy,
    selectionList
  );

  if (!retirePoolTokenPayload) return;

  const retireResult = await store.dispatch(
    retirePoolTokenCall(retirePoolTokenPayload.firstStep)
  );

  if ("error" in retireResult)
    throw new Error("Failed to execute retire first step");

  await checkDefiCallResult(retireResult.data.tx_hash, "retire first step");

  await executeSecondStep(
    retirePoolTokenPayload.secondStep,
    retireResult.data!.tx_hash,
    formValues
  );
};

const executeRetire = async (
  strategy: PoolStrategy,
  selectionList: RetireSelectionAsset[],
  formValues: RetireConfirmParams
) => {
  await executeRetireEnergyAttributeTokens(strategy, selectionList, formValues);
  await executeRetirePoolToken(strategy, selectionList, formValues);
};

export const retire = async ({
  strategy,
  selectionList,
  formValues,
  poolTokenDepositAddress,
  txFeeDepositAddress,
}: {
  strategy: PoolStrategy;
  selectionList: RetireSelectionAsset[];
  formValues: RetireConfirmParams;
  poolTokenDepositAddress: string;
  txFeeDepositAddress: string;
}) => {
  try {
    await topUpDefiBalances({
      strategy,
      poolTokenDepositAddress,
      txFeeDepositAddress,
      selectionList: selectionList.filter(({ asset }) =>
        areAssetsEqual(asset, process.env.NEXT_PUBLIC_POOL_TOKEN as string)
      ),
    });

    await executeRetire(strategy, selectionList, formValues);
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
};
