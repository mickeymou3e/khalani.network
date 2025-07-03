import { Box } from "@mui/material";

import { Button } from "@/components/atoms";
import {
  Asset as AssetComponent,
  CellClickFunc,
  ChangeCell,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { Symbols } from "@/definitions/types";

export const namespace = "markets-page";

export enum ColumnKeys {
  Asset = "id",
  MarketPrice = "marketPrice",
  Buy = "askPrice",
  Sell = "bidPrice",
  Trade = "trade",
}

export const createColumnConfig = (t: TFunc): ColumnProps[] => [
  {
    title: t(`${namespace}:asset`),
    key: ColumnKeys.Asset,
    width: "25%",
    sortable: true,
    cellRenderer: (row: RowProps) => {
      const asset = {
        icon: row.base,
        label: row.pair,
        description: row.fullName,
      };

      return <AssetComponent asset={asset} showDescription />;
    },
  },
  {
    title: t(`${namespace}:marketPrice`),
    key: ColumnKeys.MarketPrice,
    width: "25%",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <ValueCell value={row.marketPrice || Symbols.NoValue} />
    ),
  },
  {
    title: t(`${namespace}:buy`),
    key: ColumnKeys.Buy,
    width: "25%",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <ChangeCell
        change={row.askPrice || Symbols.NoValue}
        changeDirection={1}
      />
    ),
  },
  {
    title: t(`${namespace}:sell`),
    key: ColumnKeys.Sell,
    width: "25%",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <ChangeCell
        change={row.bidPrice || Symbols.NoValue}
        changeDirection={-1}
      />
    ),
  },
  {
    title: t(`${namespace}:action`),
    key: ColumnKeys.Trade,
    cellRenderer: (
      row: RowProps,
      column: ColumnProps,
      onClick: CellClickFunc
    ) => (
      <Box textAlign="right">
        <Button
          variant="outlined"
          size="small"
          onClick={() => onClick(row, column)}
        >
          {t(`${namespace}:trade`)}
        </Button>
      </Box>
    ),
  },
];
