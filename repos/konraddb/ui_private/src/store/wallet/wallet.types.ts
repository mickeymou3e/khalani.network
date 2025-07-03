import { CryptoDepositHistoryRecordProps } from "@/services/wallet";

export type DepositHistoryRecordProps = {
  explorerUrl?: string;
  isFiat?: boolean;
} & CryptoDepositHistoryRecordProps;
