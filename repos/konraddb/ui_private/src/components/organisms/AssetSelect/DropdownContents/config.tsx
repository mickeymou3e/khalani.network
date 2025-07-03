import {
  Asset,
  ChangeCell,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { Symbols } from "@/definitions/types";

export const namespace = "trade-page:assetSelector";

export enum ColumnKeys {
  Favourite = "favourite",
  Pair = "id",
  MarketPrice = "marketPrice",
  BidPrice = "bidPrice",
  AskPrice = "askPrice",
}

export const createColumnConfig = (t: TFunc): ColumnProps[] => [
  {
    title: t(`${namespace}:pair`),
    key: ColumnKeys.Pair,
    width: "25%",
    cellRenderer: (row: RowProps) => {
      const asset = {
        icon: row.base,
        label: row.pair,
        description: row.fullName,
      };

      return <Asset asset={asset} showDescription />;
    },
  },
  {
    title: t(`${namespace}:marketPrice`),
    key: ColumnKeys.MarketPrice,
    width: "25%",
    cellRenderer: (row: RowProps) => (
      <ValueCell value={row.marketPrice || Symbols.NoValue} />
    ),
  },
  {
    title: t(`${namespace}:askPrice`),
    key: ColumnKeys.AskPrice,
    width: "25%",
    cellRenderer: (row: RowProps) => (
      <ChangeCell
        change={row.askPrice || Symbols.NoValue}
        changeDirection={1}
      />
    ),
  },
  {
    title: t(`${namespace}:bidPrice`),
    key: ColumnKeys.BidPrice,
    width: "25%",
    cellRenderer: (row: RowProps) => (
      <ChangeCell
        change={row.bidPrice || Symbols.NoValue}
        changeDirection={-1}
      />
    ),
  },
];
