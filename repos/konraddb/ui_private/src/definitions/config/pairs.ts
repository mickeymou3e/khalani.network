import { defaultBaseAsset, defaultQuoteAsset } from "@/definitions/config/assets";

export type TradedPair = {
  base: string;
  quote: string;
  pair: string;
};

export const tradedPairs: TradedPair[] = [
  {
    base: defaultBaseAsset.code,
    quote: defaultQuoteAsset.code,
    pair: `${defaultBaseAsset.code}/${defaultQuoteAsset.code}`,
  },
];
