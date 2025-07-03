import { Button } from "@/components/atoms";
import {
  Asset,
  CellClickFunc,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { hideNumericValues } from "@/utils/formatters";

import { namespace } from "../../config";

export enum PortfolioColumnKeys {
  Currency = "currency",
  Available = "available",
  AvailableToTrade = "availableToTrade",
  Total = "total",
  Action = "action",
}

export const createTitleKey = (t: TFunc, key: string) => ({
  title: t(`${namespace}:${key}`),
  key,
});

export const createColumnConfig = (
  t: TFunc,
  hideValues: boolean,
  isPool: boolean
) => [
  {
    ...createTitleKey(t, PortfolioColumnKeys.Currency),
    width: "320px",
    sortable: true,
    cellRenderer: (row: RowProps) => {
      const asset = {
        icon: row.asset,
        label: row.asset,
        description: row.assetName,
      };

      return <Asset asset={asset} description={row.assetName} />;
    },
  },
  {
    ...createTitleKey(t, PortfolioColumnKeys.Available),
    width: "230px",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <ValueCell
        value={
          hideValues
            ? hideNumericValues(row.base.availableToAux)
            : row.base.availableToAux
        }
        secondaryValue={
          hideValues && row.quote.availableToAux
            ? hideNumericValues(row.quote.availableToAux)
            : row.quote.availableToAux
        }
      />
    ),
  },
  {
    ...createTitleKey(t, PortfolioColumnKeys.AvailableToTrade),
    width: "230px",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <ValueCell
        value={
          hideValues
            ? hideNumericValues(row.base.availableToTrade)
            : row.base.availableToTrade
        }
        secondaryValue={
          hideValues && row.quote.availableToTrade
            ? hideNumericValues(row.quote.availableToTrade)
            : row.quote.availableToTrade
        }
      />
    ),
  },
  {
    ...createTitleKey(t, PortfolioColumnKeys.Total),
    width: "230px",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <ValueCell
        value={hideValues ? hideNumericValues(row.base.total) : row.base.total}
        secondaryValue={
          hideValues && row.quote.total
            ? hideNumericValues(row.quote.total)
            : row.quote.total
        }
      />
    ),
  },
  {
    ...createTitleKey(t, PortfolioColumnKeys.Action),
    width: "108px",
    cellRenderer: (
      row: RowProps,
      column: ColumnProps,
      onClick: CellClickFunc
    ) => (
      <Button
        variant="outlined"
        size="small"
        onClick={() => onClick(row, column)}
      >
        {isPool ? t(`${namespace}:trade`) : t(`${namespace}:deposit`)}
      </Button>
    ),
  },
];
