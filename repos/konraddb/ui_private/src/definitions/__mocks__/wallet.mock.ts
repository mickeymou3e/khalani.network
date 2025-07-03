import { customerCodeMock } from "@/definitions/__mocks__/account.mock";

export const maticPolygonCustodyWalletCode =
  "669e5a7a-a48a-4df9-ba55-415623552811";
export const jltCustodyWalletCode = "ef148c21-0799-4b68-930c-11fdcb0ec29d";

export const maticPolygonCustodyWalletMock = {
  accounting_type: "regular",
  balance: {
    available: "0.225",
    locked: "0",
    total: "0.225",
  },
  client_code: "b4137ae0-e941-45b2-a9c3-9f1c16f49428",
  code: maticPolygonCustodyWalletCode,
  compliance_addresses: [
    {
      address: "0x60aea571a9d5ED1F649035B974D0E42353C1A3fb",
      state: "active",
    },
  ],
  created_at: "2023-11-08T00:58:02.213Z",
  currency_code: "matic_polygon",
  customer_code: customerCodeMock,
  is_new_provider: true,
  label: "MATIC-AUX",
  state: "active",
  type: "manual",
};

export const jltCustodyWalletMock = {
  accounting_type: "trading",
  balance: {
    available: "3",
    locked: "0",
    total: "3",
  },
  client_code: "b4137ae0-e941-45b2-a9c3-9f1c16f49428",
  code: jltCustodyWalletCode,
  compliance_addresses: [
    {
      address: "0x60aea571a9d5ED1F649035B974D0E42353C1A3fb",
      state: "active",
    },
  ],
  created_at: "2023-11-08T00:58:05.629Z",
  currency_code: "jlt_f23",
  customer_code: customerCodeMock,
  is_new_provider: true,
  label: "JLT_F23-AUX",
  state: "active",
  type: "manual",
};

export const custodyWalletMock = [
  maticPolygonCustodyWalletMock,
  jltCustodyWalletMock,
];

export const btcAssetDetailsMock = {
  blockchain_network: "BITCOIN_TESTNET",
  code: "BTC",
  decimals: 8,
  fee_value: 155,
  is_boostable: false,
  label: "Bitcoin",
  tx_explorer_url: "https://live.blockcypher.com/btc-testnet/tx/",
  type: "base",
};

export const ethAssetDetailsMock = {
  blockchain_network: "BITCOIN_CASH_TESTNET",
  code: "BCH",
  decimals: 8,
  fee_value: 226,
  is_boostable: false,
  label: "Bitcoin Cash",
  tx_explorer_url: "https://www.blockchain.com/bch-testnet/tx/",
  type: "base",
};
