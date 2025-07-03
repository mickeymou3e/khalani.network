import { BridgeStatus, TxSettings } from "@/definitions/types";
import { BridgeMode } from "@/features/BridgePage/BridgePage.types";

export type BridgeSelectionAsset = {
  asset: string;
  amount: number;
};

export interface BridgeSliceProps {
  mode: BridgeMode;
  asset: string;
  registry: string;
  selectionList: BridgeSelectionAsset[];
  tab: GridTabs;
}

export type DropdownAssets = {
  id: string;
  asset: string;
  registry: string;
  icon: string;
  balance: string;
  balanceValue: number;
};

export type SelectionItem = {
  id: string;
  name: string;
  icon: string;
  amount: string;
  amountValue: number;
};

export enum GridTabs {
  OpenRequests = "openRequests",
  History = "history",
}

export type BridgeRequestEntry = {
  id: string;
  vintage: string;
  facilityName: string;
  registry: string;
  quantity: number;
  techType: string;
  direction: string;
};

export type BridgeRequestsResponse = {
  requests: BridgeRequestEntry[];
};

export type OpenRequestGridRow = {
  id: string;
  credit: string;
  type: BridgeMode;
  registry: string;
  amount: string;
  amountValue: number;
  status: BridgeStatus;
  vintage: Date;
  icon: string;
};

export type SignatureResponse = {
  certificateId: string;
  signature: string;
  deadline: number;
  nonce: string;
  tokenSeriesId: string;
  oracleData: string;
};

export type BridgeInRequest = {
  strategyCode: string;
  tokenId: string;
  amount: string;
  oracleData: string;
  deadline: string;
  nonce: string;
  sig: string;
  txSettings: TxSettings;
};

export type BridgeHistory = {
  id: string;
  vintage: string;
  facilityName: string;
  registry: string;
  quantity: number;
  techType: string;
  direction: string;
  transactionHash: string;
  completedAt: string;
};

export type BridgeHistoryResponse = {
  history: BridgeHistory[];
};

export type ApproveOperatorRequest = {
  strategyCode: string;
  operator: string;
  txSettings: TxSettings;
};

export type BridgeOutRequest = {
  strategyCode: string;
  ids: string;
  values: string;
  metadata: string;
  txSettings: TxSettings;
};

export type EligibilityRequestProps = {
  strategyCode: string;
  methodName: string;
  params: {
    operator: string;
    account: string;
  };
};

export type EligibilityResponseProps = {
  result: string;
};
