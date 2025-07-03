import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { IconButton } from "@/components/atoms";
import { ColumnProps, RowProps } from "@/components/molecules";
import { ChipColorProps } from "@/styles/types/chip";
import { formatDateToIso } from "@/utils/dateFormatters";
import { evaluate } from "@/utils/logic";

import { namespace } from "../../config";

enum TransactionStatus {
  on_compliance = "on-compliance",
  aml_checked = "aml-checked",
  done = "done",
  pending = "pending",
  failed = "failed",
}

export enum ColumnKeys {
  Date = "compliance_received_at",
  Amount = "compliance_amount",
  Type = "isFiat",
  Status = "state",
  Tx = "tx",
}

export const createColumnConfig = (t: TFunc): ColumnProps[] => [
  {
    title: t(`${namespace}:date`),
    key: ColumnKeys.Date,
    width: "204px",
    sortable: true,
    cellRenderer: (row: RowProps) => {
      const [date, time] = formatDateToIso(row?.compliance_received_at);
      return (
        <Box>
          <Typography variant="body2">{date}</Typography>
          <Typography variant="caption" color="primary.gray2">
            {time}
          </Typography>
        </Box>
      );
    }
  },
  {
    title: t(`${namespace}:amount`),
    key: ColumnKeys.Amount,
    width: "204px",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <Typography variant="body2" mx="auto">{`${
        row?.compliance_amount
      } ${row?.currency_code?.toUpperCase()}`}</Typography>
    )
  },
  {
    title: t(`${namespace}:type`),
    key: ColumnKeys.Type,
    width: "204px",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <Typography variant="body2">{row?.isFiat ? "Fiat" : "Token"}</Typography>
    )
  },
  {
    title: t(`${namespace}:status`),
    key: ColumnKeys.Status,
    width: "204px",
    sortable: true,
    cellRenderer: (row: RowProps) => {
      const chipLabel = evaluate(
        [
          row?.state === TransactionStatus.done,
          ["Completed", ChipColorProps.success]
        ],
        [
          row?.state === TransactionStatus.pending || row?.state === TransactionStatus.on_compliance || row?.state === TransactionStatus.aml_checked,
          ["Pending", ChipColorProps.info]
        ],
        [
          row?.state === TransactionStatus.failed,
          ["Failed", ChipColorProps.error]
        ]
      ) as [string, ChipColorProps];

      if (!chipLabel) return <Typography variant="body2">-</Typography>;

      return <Chip size="small" label={chipLabel[0]} color={chipLabel[1]} />;
    }
  },
  {
    title: t(`${namespace}:tx`),
    key: ColumnKeys.Tx,
    width: "64px",
    align: "center",
    cellRenderer: (row: RowProps) => {
      if (!row?.explorerUrl || !row?.compliance_tx_hash) return <Box />;
      return (
        <Box display="flex" justifyContent="center">
          <IconButton
            variant="outlined"
            size="small"
            disabled={row?.state === TransactionStatus.failed}
            onClick={() =>
              window.open(`${row?.explorerUrl}${row?.compliance_tx_hash}`)
            }
          >
            <OpenInNewIcon />
          </IconButton>
        </Box>
      );
    }
  }
];
