import { CellClickFunc, ColumnProps, RowProps } from "@/components/DataGrid";
import { IconButton } from "@/components/IconButton";
import { Box } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export enum DataGridColumns {
  ITEM = "ITEM",
  DATE = "DATE",
  QUANTITY = "QUANTITY",
  UNIT = "UNIT",
  TYPE = "TYPE",
  SCOPE = "SCOPE",
  PROVIDER = "PROVIDER",
  ISVERIFIED = "ISVERIFIED",
  DELETE = "DELETE",
}

export const columnConfig = [
  { key: DataGridColumns.ITEM, title: "Item" },
  { key: DataGridColumns.DATE, title: "Date" },
  { key: DataGridColumns.QUANTITY, title: "Quantity" },
  { key: DataGridColumns.UNIT, title: "Unit" },
  { key: DataGridColumns.TYPE, title: "Type" },
  { key: DataGridColumns.SCOPE, title: "Scope" },
  { key: DataGridColumns.PROVIDER, title: "Provider" },
  { key: DataGridColumns.ISVERIFIED, title: "Verify selected" },
  {
    key: DataGridColumns.DELETE,
    title: "",
    cellRenderer: (
      row: RowProps,
      column: ColumnProps,
      onClick: CellClickFunc
    ) => (
      <Box textAlign="right">
        <IconButton
          variant="outlined"
          size="small"
          onClick={() => onClick(row, column)}
          sx={{ px: 2 }}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Box>
    ),
  },
];
