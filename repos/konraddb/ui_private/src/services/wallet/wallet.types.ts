import { AddressState } from "@/definitions/types";

export interface WalletAssetProps {
  blockchain_network: string;
  code: string;
  decimals: number;
  fee_value: number;
  is_boostable: boolean;
  label: string;
  tx_explorer_url: string;
  type: string;
  name: string;
  value: string;
  assets: [
    {
      icon: string;
      label: string;
      description: string;
    }
  ];
}

interface BalanceProps {
  available: string;
  locked: string;
  total: string;
}

interface ComplianceAddressProps {
  address: string;
  state: string;
}

export interface CryptoDepositWalletsProps {
  accounting_type: string;
  balance: BalanceProps;
  client_code: string;
  code: string;
  compliance_addresses: ComplianceAddressProps[];
  created_at: string;
  currency_code: string;
  is_new_provider: boolean;
  label: string;
  state: string;
  type: string;
}

export interface CryptoDepositHistoryRecordProps {
  aml_checks: null;
  client_uuid: string;
  code: string;
  compliance_amount: string;
  compliance_amount_usd: string;
  compliance_received_at: Date;
  compliance_to_custody_fee: string;
  compliance_to_custody_fee_currency_code: null;
  compliance_tx_hash: string;
  currency_code: string;
  custody_amount: string;
  custody_failure_raw_error: null;
  custody_received_at: null;
  custody_tx_hash: null;
  deposit_address: string;
  deposit_sources: { address: string }[];
  state: string;
  wallet_code: string;
}

export interface WhitelistAddressRequestProps {
  currency: string;
  address: string;
  label: string;
  memo: string;
  totp_code: string;
  wallet_code: string;
}

export interface WhitelistAddressResponseProps {
  address: string;
  client_code: string;
  code: string;
  created_at: null;
  creator_code: string;
  currency: string;
  customer_code: null;
  label: string;
  memo: null;
  state: string;
  updated_at: null;
  wallet_code: string;
}

export interface CryptoWithdrawalHistoryRecordProps {
  aml_checks: null;
  client_uuid: string;
  code: string;
  created_at: Date;
  creator_code: string;
  currency_code: string;
  custom_fee_size: string;
  destination_address: {
    address: string;
    client_code: string;
    code: string;
    created_at: Date;
    creator_code: string;
    currency: string;
    customer_code: null;
    label: string;
    memo: null;
    state: string;
    updated_at: Date;
    wallet_code: null;
  };
  destination_type: string;
  destination_wallet: {
    balance: {
      available: string;
      locked: string;
      total: string;
    };
    client_code: string;
    code: string;
    compliance_addresses?: [
      {
        address: string;
        balance: {
          available: string;
          locked: string;
          total: string;
        };
        legacy_address: string;
        state: string;
      }
    ];
    created_at: string;
    currency_code: string;
    customer_code: string;
    is_new_provider: boolean;
    label: string;
    state: string;
    type: string;
  } | null;
  failure_raw_error: null;
  failure_reason: null;
  fee: string;
  fee_currency_code: null;
  fee_level: string;
  received_amount: string;
  requested_amount: string;
  requested_amount_usd: string;
  source_address: string;
  state: string;
  tx_hash: null;
  updated_at: Date;
  wallet_code: string;
}

export interface CryptoWithdrawalsWalletsProps {
  address: string;
  client_code: string;
  code: string;
  created_at: Date;
  creator_code: string;
  currency: string;
  customer_code: null;
  label: string;
  memo: null;
  state: AddressState;
  updated_at: Date;
  wallet_code: null;
}

export interface CreateWalletRequestProps {
  currency_code: string;
  fee_source_wallet_code: string;
  label: string;
}

interface ComplianceAddress {
  address: string;
  legacy_address: string;
  state: string;
}

export interface CreateWalletResponseProps {
  client_code: string;
  code: string;
  compliance_addresses: ComplianceAddress[];
  created_at: Date;
  currency_code: string;
  is_new_provider: boolean;
  label: string;
  state: string;
  type: string;
}

export interface WithdrawalRequestProps {
  address_code: string;
  amount: string;
  currency: string;
  fee_level: string;
  custom_fee_size: string;
  reference_id: string;
  wallet_code: string;
  code: string;
}

interface DestinationAddress {
  address: string;
  client_code: string;
  code: string;
  created_at: Date;
  creator_code: string;
  currency: string;
  customer_code: null;
  label: string;
  memo: null;
  state: string;
  updated_at: Date;
  wallet_code: null;
}

export interface WithdrawalResponseProps {
  aml_checks: null;
  client_uuid: string;
  code: string;
  created_at: null;
  creator_code: string;
  currency_code: string;
  custom_fee_size: string;
  destination_address: DestinationAddress;
  destination_type: string;
  destination_wallet: null;
  failure_raw_error: null;
  failure_reason: null;
  fee: string;
  fee_currency_code: null;
  fee_level: string;
  received_amount: string;
  requested_amount: string;
  requested_amount_usd: string;
  source_address: string;
  state: string;
  tx_hash: null;
  updated_at: null;
  wallet_code: string;
}

export interface AddressDeleteRequestProps {
  addressId: string;
}
