import CopyToClipboard from "react-copy-to-clipboard";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Typography } from "@mui/material";

import { IconButton } from "@/components/atoms";
import { ColumnProps, RowProps } from "@/components/molecules";
import { ApiKeyTypes } from "@/definitions/types";

import { namespace } from "../config";

export enum ColumnKeys {
  Label = "Label",
  KeyAccess = "KeyAccess",
  PublicKey = "PublicKey",
  Buttons = "Buttons",
}

export const createColumnConfig = (t: TFunc): ColumnProps[] =>
  [
    {
      title: t(`${namespace}:apiLabel`),
      key: ColumnKeys.Label,
      sortable: true,
      width: "140px",
      cellRenderer: (row: RowProps) => (
        <Typography variant="body2">{row?.label}</Typography>
      ),
    },
    {
      title: t(`${namespace}:apiKey`),
      key: ColumnKeys.KeyAccess,
      sortable: true,
      width: "240px",
      cellRenderer: (row: RowProps) => (
        <Typography variant="body2">
          {row?.type === ApiKeyTypes.Trade
            ? ApiKeyTypes.Trade
            : ApiKeyTypes.Read}
        </Typography>
      ),
    },
    {
      title: t(`${namespace}:publicKey`),
      key: ColumnKeys.PublicKey,
      sortable: true,
      width: "580px",
      cellRenderer: (row: RowProps) => (
        <Typography variant="body2">{row?.key}</Typography>
      ),
    },
    {
      title: "",
      key: ColumnKeys.Buttons,
      width: "64px",
      cellRenderer: (row: RowProps, column, handleCellClick) => (
        <Box display="flex" gap={3}>
          <CopyToClipboard text={row.key}>
            <IconButton
              variant="outlined"
              size="small"
              complete
              disabledIcon={<CheckOutlinedIcon />}
            >
              <ContentCopyIcon />
            </IconButton>
          </CopyToClipboard>

          <IconButton
            variant="outlined"
            size="small"
            onClick={() => handleCellClick(row, column)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      ),
    },
  ] as ColumnProps[];
