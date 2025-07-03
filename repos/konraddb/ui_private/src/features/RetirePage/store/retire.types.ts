import { TxSettings } from "@/definitions/types";

export type RetireSelectionAsset = {
  asset: string;
  amount: number;
};

export interface RetireSliceProps {
  selectedAsset: string | null;
  selectionList: RetireSelectionAsset[];
}

export type DropdownAssets = {
  id: string;
  asset: string;
  icon: string;
  balance: string;
  balanceValue: number;
  total: string;
};

export type PoolOptions = {
  id: string;
  asset: string;
  description: string;
  icon: string;
  balance: string;
  balanceValue: number;
  total: string;
};

export type SelectionItem = {
  id: string;
  name: string;
  icon: string;
  amount: string;
  amountValue: number;
};

export type RetireEnergyAttributeTokenRequestParams = {
  strategyCode: string;
  ids: string;
  values: string;
  txSettings: TxSettings;
};

export type RetirePoolTokenRequestParams = {
  strategyCode: string;
  amount: string;
  txSettings: TxSettings;
};

export type RetireConfirmParams = {
  beneficiary: string;
  auditYear: string;
  reason: string;
  eAudit: false;
};

export type RetireConfirmRequestParams = {
  quantity: number;
  transactionHash: string;
  reason: string;
  beneficiary: string;
  auditRequested: boolean;
  auditYear: number;
  retirementType: string;
};

export type RetireConfirmResponse = {
  status: string;
};

export type RetireResponse = {
  tx_hash: string;
};

export enum RetirementType {
  EAT = "EAT",
  JLT = "JLT",
}
