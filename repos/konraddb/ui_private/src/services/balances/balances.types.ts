import { AccountType } from "@/definitions/config";

export type BalanceEntry = {
  available: string;
  code: string;
  locked: string;
  total: string;
  type: AccountType;
};

export type Balance = {
  accounts: BalanceEntry[];
  available: string;
  code: string;
  is_fiat?: boolean;
  locked: string;
  name: string;
  total: string;
};

export type AssetNameMap = {
  [key: string]: string;
};
