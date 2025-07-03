import { Box, Typography } from "@mui/material";

import { Growth } from "@/components/atoms/CustomIcons";
import { DataGrid } from "@/components/molecules";

import { placeholderStyle } from "./PoolFiat.styles";
import { usePoolFiat } from "./usePoolFiat";

export enum PoolFiatMode {
  Pool = "pool",
  Fiat = "fiat",
}

type PoolFiatProps = {
  mode: PoolFiatMode;
  searchKeyword: string;
};

const PoolFiat = ({ mode, searchKeyword }: PoolFiatProps) => {
  const {
    columns,
    dataProvider,
    hideZeroBalances,
    listLength,
    noDataText,
    zeroBalanceHidden,
    handleCellClick,
    handlePageSizeChange,
  } = usePoolFiat(mode, searchKeyword);

  return (
    <DataGrid
      columns={columns}
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

export default PoolFiat;
