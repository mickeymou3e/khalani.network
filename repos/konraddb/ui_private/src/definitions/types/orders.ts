import { ExecutionSide } from "./exchange";

export type Order = {
  action: string | ExecutionSide;
  amount: string;
  client_code: string;
  code: string;
  created: string;
  creator_code: string;
  customer_code: string;
  executed: {
    amount: string;
    bank_fee: string;
    broker_fee: string;
    partial?: boolean;
    price: string;
    value: string;
  };
  external_code?: string;
  finished: string | null;
  kind: string;
  limit_price: string;
  market_item: {
    base: string;
    quote: string;
  };
  status: string;
  type: string;
};
