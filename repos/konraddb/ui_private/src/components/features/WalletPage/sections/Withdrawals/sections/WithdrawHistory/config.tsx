import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { IconButton } from "@/components/atoms";
import { ColumnProps, RowProps, ValueCell } from "@/components/molecules";
import { ChipColorProps } from "@/styles/types/chip";
import { createTitleKey } from "@/utils/dataGrid.helpers";
import { formatDateToIso } from "@/utils/dateFormatters";
import { getUserRoleIconPath } from "@/utils/general";
import { evaluate } from "@/utils/logic";

import { namespace } from "../../config";

enum TransactionStatus {
  signed = "signed",
  failed = "failed",
  pending_sign = "pending_sign",
  pending = "pending",
  done = "done",
  finalize_done = "finalize_done",
}

export enum ColumnKeys {
  User = "user",
  Date = "updated_at",
  Amount = "amount",
  Type = "type",
  Fee = "fee",
  Status = "status",
  Tx = "tx",
}

export const createColumnConfig = (isAdmin: boolean, t: TFunc) => {
  const userColumn = isAdmin
    ? {
        ...createTitleKey(t, ColumnKeys.User, namespace),
        sortable: true,
        cellRenderer: (row: RowProps) => {
          if (!row.user) return null;

          const iconPath = getUserRoleIconPath(row.role);
          const role = t(`${namespace}:${row.role}`);

          return (
            <ValueCell
              value={row.user}
              secondaryValue={role}
              icon={iconPath}
              small
            />
          );
        },
      }
    : null;

  return [
    ...(userColumn ? [userColumn] : []),
    {
      ...createTitleKey(t, ColumnKeys.Date, namespace),
      width: "163px",
      sortable: true,
      cellRenderer: (row: RowProps) => {
        const [date, time] = formatDateToIso(row?.updated_at);
        return (
          <Box>
            <Typography variant="body2">{date}</Typography>
            <Typography variant="caption" color="primary.gray2">
              {time}
            </Typography>
          </Box>
        );
      },
    },
    {
      ...createTitleKey(t, ColumnKeys.Amount, namespace),
      width: "163px",
      sortable: true,
      cellRenderer: (row: RowProps) => (
        <Typography variant="body2">{`${
          row?.requested_amount
        } ${row?.currency_code.toUpperCase()}`}</Typography>
      ),
    },
    {
      ...createTitleKey(t, ColumnKeys.Type, namespace),
      width: "163px",
      sortable: true,
      cellRenderer: (row: RowProps) => (
        <Typography variant="body2">
          {row?.isFiat ? "Fiat" : "Token"}
        </Typography>
      ),
    },

    {
      ...createTitleKey(t, ColumnKeys.Fee, namespace),
      width: "163px",
      sortable: true,
      cellRenderer: () => (
        <Typography variant="body2">0</Typography>
      ),
    },
    {
      ...createTitleKey(t, ColumnKeys.Status, namespace),
      width: "163px",
      sortable: true,
      cellRenderer: (row: RowProps) => {
        const chipLabel = evaluate(
          [
            row?.state === TransactionStatus.pending ||
              row?.state === TransactionStatus.finalize_done || row?.state === TransactionStatus.signed,
            ["Pending", ChipColorProps.info],
          ],
          [
            row?.state === TransactionStatus.failed,
            ["Failed", ChipColorProps.error],
          ],
          [
            row?.state === TransactionStatus.done,
            ["Completed", ChipColorProps.success],
          ]
        ) as [string, ChipColorProps];

        if (!chipLabel) return <Typography variant="body2">-</Typography>;

        return <Chip size="small" label={chipLabel[0]} color={chipLabel[1]} />;
      },
    },
    {
      ...createTitleKey(t, ColumnKeys.Tx, namespace),
      width: "64px",
      cellRenderer: (row: RowProps) => (
        <Box display="flex" gap={2}>
          <IconButton
            size="small"
            variant="outlined"
            disabled={row?.state !== TransactionStatus.done}
            onClick={() => window.open(`${row?.explorerUrl}${row?.tx_hash}`)}
          >
            <OpenInNewOutlinedIcon />
          </IconButton>
        </Box>
      ),
    },
  ] as ColumnProps[];
};
