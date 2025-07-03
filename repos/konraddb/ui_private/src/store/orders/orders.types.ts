import { Order } from "@/definitions/types";

export type OrderWithUser = {
  user?: string;
  userCode?: string;
  role?: string;
} & Order;

export type OrderBookData = {
  id: string;
  orderId: string;
  createdDate: string;
  createdTime: string;
  finishedDate: string;
  finishedTime: string;
  date: string;
  time: string;
  base: string;
  quote: string;
  pair: string;
  side: string;
  type: string;
  initialAmount: string;
  executedAmount: string;
  amount: string;
  priceBase: string;
  price: string;
  total: string;
  status: string;
  filledPercentage: string;
  filledPercentageValue: number;
  isPartial: boolean;
  isOpen: boolean;
  user?: string;
  userCode?: string;
  role?: string;
};
