import Typography from "@mui/material/Typography";

import { Asset, ColumnProps, RowProps } from "@/components/molecules";

export const namespace = "wallet-page:banks";
export const commonNamespace = "common";

export enum ColumnKeys {
  Bank = "bank",
  AccountHolder = "accountHolder",
  Currency = "currency",
  Swift = "Swift",
  Iban = "Iban",
}

export const createColumnConfig = (t: TFunc): ColumnProps[] => [
  // Note: That section is only temporarily hidden, it will be needed in the future.
  // {
  //   title: t(`${namespace}:bank`),
  //   key: ColumnKeys.Bank,
  //   width: "200px",
  //   cellRenderer: () => (
  //     <Typography variant="body2">{Symbols.NoValue}</Typography>
  //   ),
  // },
  // {
  //   title: t(`${namespace}:accountHolder`),
  //   key: ColumnKeys.AccountHolder,
  //   width: "200px",
  //   cellRenderer: () => (
  //     <Typography variant="body2">{Symbols.NoValue}</Typography>
  //   ),
  // },
  {
    title: t(`${namespace}:currency`),
    key: ColumnKeys.Bank,
    width: "200px",
    cellRenderer: (row: RowProps) => {
      const asset = {
        icon: row.currency,
        label: row.currency,
      };

      return <Asset asset={asset} />;
    },
  },
  // Note: That section is only temporarily hidden, it will be needed in the future.
  // {
  //   title: t(`${namespace}:swift`),
  //   key: ColumnKeys.Swift,
  //   width: "200px",
  //   cellRenderer: () => (
  //     <Typography variant="body2">{Symbols.NoValue}</Typography>
  //   ),
  // },
  {
    title: t(`${namespace}:iban`),
    key: ColumnKeys.Iban,
    width: "1px",
    cellRenderer: (row: RowProps) => (
      <Typography variant="body2">{row.iban}</Typography>
    ),
  },
];
