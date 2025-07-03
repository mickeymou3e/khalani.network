import { Asset, RowProps, ValueCell } from "@/components/molecules";

import { createTitleKey } from "../config";

export enum PortfolioColumnKeys {
  Currency = "currency",
  Available = "available",
  InOrders = "inOrders",
  Total = "total",
}

export const createPortfolioColumns = (t: TFunc) => [
  {
    ...createTitleKey(t, PortfolioColumnKeys.Currency),
    cellRenderer: (row: RowProps) => {
      const asset = {
        icon: row.asset,
        label: row.asset,
        description: row.assetName,
      };

      return <Asset asset={asset} description={asset.description} />;
    },
  },
  {
    ...createTitleKey(t, PortfolioColumnKeys.Available),
    cellRenderer: (row: RowProps) => (
      <ValueCell
        value={row.base.availableToTrade}
        secondaryValue={row.quote.availableToTrade}
      />
    ),
  },
  {
    ...createTitleKey(t, PortfolioColumnKeys.InOrders),
    cellRenderer: (row: RowProps) => (
      <ValueCell
        value={row.base.inOrders}
        secondaryValue={row.quote.inOrders}
      />
    ),
  },
  {
    ...createTitleKey(t, PortfolioColumnKeys.Total),
    cellRenderer: (row: RowProps) => (
      <ValueCell value={row.base.total} secondaryValue={row.quote.total} />
    ),
  },
];
