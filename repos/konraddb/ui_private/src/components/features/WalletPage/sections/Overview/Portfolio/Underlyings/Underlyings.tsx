import { Box, Typography } from "@mui/material";

import { Growth } from "@/components/atoms/CustomIcons";
import { DataGrid } from "@/components/molecules";

import { placeholderStyle } from "./Underlyings.styles";
import { useUnderlyings } from "./useUnderlyings";

type UnderlyingsProps = {
  searchKeyword: string;
};

const Underlyings = ({ searchKeyword }: UnderlyingsProps) => {
  const {
    columnConfig,
    dataProvider,
    listLength,
    hideZeroBalances,
    noDataText,
    zeroBalanceHidden,
    handleCellClick,
    handlePageSizeChange,
  } = useUnderlyings(searchKeyword);

  return (
    <DataGrid
      columns={columnConfig}
      dataProvider={dataProvider}
      placeholder={noDataText}
      onCellClick={handleCellClick}
      pageSize={listLength}
      onPageSizeChange={handlePageSizeChange}
      enableHorizontalScroll
      searchKeyword={searchKeyword}
    >
      {hideZeroBalances && !dataProvider.length && (
        <Box sx={placeholderStyle}>
          <Growth />
          <Typography variant="body2" color="primary.gray2">
            {zeroBalanceHidden}
          </Typography>
        </Box>
      )}
    </DataGrid>
  );
};

export default Underlyings;
