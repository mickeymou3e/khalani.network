import { RowProps } from "@/components/DataGrid";
import { DataGridColumns } from "./Data.config";

export const mapFileDataToDataGrid = (fileData: {
  created_at: string;
  file_key: string;
  file_name: string;
  user_id: string;
}): RowProps => {
  return {
    fileKey: fileData.file_key,
    [DataGridColumns.ITEM]: fileData.file_name,
    [DataGridColumns.DATE]: new Date(fileData.created_at).toLocaleDateString(),
    [DataGridColumns.QUANTITY]: "",
    [DataGridColumns.UNIT]: "",
    [DataGridColumns.TYPE]: "Document",
    [DataGridColumns.SCOPE]: "",
    [DataGridColumns.PROVIDER]: "",
    [DataGridColumns.ISVERIFIED]: false,
  };
};
