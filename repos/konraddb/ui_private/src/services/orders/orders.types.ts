import { ExecutionSide, Order, OrderType } from "@/definitions/types";

export type OrdersResponse = {
  records: Order[];
};

export type SubmitOrderRequest = {
  action: ExecutionSide;
  amount: string;
  base: string;
  customer_code: string;
  limit_price: string;
  quote: string;
  reference_id: string;
  rfq_offered_price: string;
  rfq_offered_price_timestamp: string;
  rfq_quote_amount: string;
  type: OrderType;
};
