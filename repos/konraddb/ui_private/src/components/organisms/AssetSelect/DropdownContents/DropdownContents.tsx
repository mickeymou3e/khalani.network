import { Box } from "@mui/material";

import { DataGrid, RowProps } from "@/components/molecules";
import { RateData } from "@/store/rates";

import { containerStyle } from "./DropdownContents.styles";
import { useDropdownContents } from "./useDropdownContents";

export type DropdownContentsProps = {
  dataProvider: RateData[];
  onSelect: (row: RowProps) => void;
  onClose: () => void;
};

const DropdownContents = ({
  dataProvider,
  onSelect,
  onClose,
}: DropdownContentsProps) => {
  const { gridColumns, handleRowClick } = useDropdownContents({
    dataProvider,
    onSelect,
    onClose,
  });

  return (
    <Box sx={containerStyle}>
      <DataGrid
        columns={gridColumns}
        dataProvider={dataProvider}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

export default DropdownContents;
