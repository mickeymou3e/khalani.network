export type Price = {
  price: string;
  volume: string;
};

export type RateResponse = {
  bids: Price[];
  asks: Price[];
  timestamp: number;
};

export type TransformedRateResponse = {
  bid: Price;
  ask: Price;
  timestamp: string;
};
