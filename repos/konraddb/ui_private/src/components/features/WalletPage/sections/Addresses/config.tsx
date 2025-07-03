import { CopyToClipboard } from "react-copy-to-clipboard";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { IconButton } from "@/components/atoms";
import { Asset, ColumnProps, RowProps } from "@/components/molecules";
import { AddressState, Symbols } from "@/definitions/types";
import { ChipColorProps } from "@/styles/types/chip";
import { evaluate } from "@/utils/logic";

export const namespace = "wallet-page:addresses";

export enum CellClickType {
  Edit = "edit",
  Delete = "delete",
}

export enum ColumnKeys {
  Label = "label",
  Currency = "currency",
  Address = "address",
  Network = "Network",
  Status = "state",
  Actions = "Actions",
}

export const createColumnConfig = (t: TFunc): ColumnProps[] => [
  {
    title: t(`${namespace}:label`),
    key: ColumnKeys.Label,
    width: "140px",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <Typography variant="body2">{row.label}</Typography>
    ),
  },
  {
    title: t(`${namespace}:currency`),
    key: ColumnKeys.Currency,
    width: "240px",
    sortable: true,
    cellRenderer: (row: RowProps) => {
      const asset = {
        icon: row.currency,
        label: row.currency,
      };

      return <Asset asset={asset} />;
    },
  },
  {
    title: t(`${namespace}:address`),
    key: ColumnKeys.Address,
    width: "392px",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <Typography variant="body2">{row.address}</Typography>
    ),
  },
  // Note: That section is only temporarily hidden, it will be needed in the future.
  // {
  //   title: t(`${namespace}:network`),
  //   key: ColumnKeys.Network,
  //   width: "120px",
  //   sortable: true,
  //   cellRenderer: () => <Typography variant="body2">---</Typography>,
  // },
  {
    title: t(`${namespace}:status`),
    key: ColumnKeys.Status,
    width: "120px",
    sortable: true,
    cellRenderer: (row: RowProps) => {
      const chipLabel = evaluate(
        [
          row?.state === AddressState.pending_sign,
          ["Pending", ChipColorProps.info],
        ],
        [
          row?.state === AddressState.pending_admin_approve,
          ["Pending", ChipColorProps.info],
        ],
        [
          row?.state === AddressState.pending_aml,
          ["Pending", ChipColorProps.info],
        ],
        [
          row?.state === AddressState.pending_admin_delete,
          ["Deleting", ChipColorProps.error],
        ],
        [
          row?.state === AddressState.approved,
          ["Approved", ChipColorProps.success],
        ]
      ) as [string, ChipColorProps];

      if (!chipLabel) return <Typography variant="body2">---</Typography>;

      return <Chip size="small" label={chipLabel[0]} color={chipLabel[1]} />;
    },
  },

  {
    title: "",
    key: ColumnKeys.Actions,
    width: "124px",
    cellRenderer: (row: RowProps, column, handleCellClick) => (
      <Box display="flex" gap={2}>
        <CopyToClipboard text={row.address ?? Symbols.NoValue}>
          <IconButton
            variant="outlined"
            complete
            size="small"
            disabledIcon={<CheckOutlinedIcon />}
          >
            <ContentCopyOutlinedIcon />
          </IconButton>
        </CopyToClipboard>

        <IconButton
          variant="outlined"
          onClick={() => handleCellClick(row, column)}
          size="small"
          disabled={row.state !== AddressState.approved}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Box>
    ),
  },
];
