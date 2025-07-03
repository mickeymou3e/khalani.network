import { customerCodeMock } from "@/definitions/__mocks__/account.mock";
import { AccountType } from "@/definitions/config";

export const balancesMock = [
  {
    accounts: [],
    available: "1000",
    code: "USD",
    is_fiat: true,
    locked: "0",
    name: "US Dollar",
    total: "1000",
  },
  {
    accounts: [],
    available: "7000",
    code: "EUR",
    is_fiat: true,
    locked: "0",
    name: "Euro",
    total: "7000",
  },
  {
    accounts: [],
    available: "25",
    code: "BTC",
    locked: "0",
    name: "Bitcoin",
    total: "25",
  },
  {
    accounts: [],
    available: "0",
    code: "LTC",
    locked: "0",
    name: "Litecoin",
    total: "0",
  },
  {
    accounts: [],
    available: "120",
    code: "ETH",
    locked: "0",
    name: "Ethereum",
    total: "120",
  },
  {
    accounts: [],
    available: "3000",
    code: "ATOM",
    locked: "0",
    name: "Cosmos",
    total: "120",
  },
];

export const tradedBalancesMock = [
  {
    accounts: [
      {
        available: "1000.25",
        code: customerCodeMock,
        locked: "10",
        total: "1010.25",
        type: AccountType.CustomerTrading,
      },
    ],
    available: "1000.25",
    code: "EUR",
    is_fiat: true,
    locked: "10",
    name: "Euro",
    total: "1010.25",
  },
  {
    accounts: [
      {
        available: "50",
        code: customerCodeMock,
        locked: "0",
        total: "50",
        type: AccountType.CustomerTrading,
      },
      {
        available: "0",
        code: "8714bbf0-a2db-443f-aa80-e0025a7b2105",
        locked: "0",
        total: "0",
        type: AccountType.TradingWallet,
      },
      {
        available: "200",
        code: "ef148c21-0799-4b68-930c-11fdcb0ec29d",
        locked: "0",
        total: "200",
        type: AccountType.TradingWallet,
      },
    ],
    available: "250",
    code: "JLT-F23",
    locked: "0",
    name: "JLT-F23",
    total: "250",
  },
];
