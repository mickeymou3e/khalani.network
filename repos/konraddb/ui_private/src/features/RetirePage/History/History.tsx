import { Stack, Typography } from "@mui/material";

import { CallToAction, DataGrid, SearchInput } from "@/components/molecules";

import { searchInputStyle } from "./History.styles";
import { useHistory } from "./useHistory";

const History = () => {
  const {
    columns,
    dataProvider,
    titleLabel,
    searchTooltip,
    noHistoryText,
    isLoggedIn,
    loginText,
    actionText,
    searchKeyword,
    pageSize,
    setSearchKeyword,
    handlePageSizeChange,
  } = useHistory();

  return (
    <Stack spacing="1.5rem">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle" color="primary.gray2">
          {titleLabel}
        </Typography>
        <SearchInput
          sx={searchInputStyle}
          value={searchKeyword}
          size="small"
          placeholder={searchTooltip}
          setValue={setSearchKeyword}
        />
      </Stack>

      <DataGrid
        columns={columns}
        dataProvider={dataProvider}
        placeholder={noHistoryText}
        pageSize={pageSize}
        enableHorizontalScroll
        onPageSizeChange={handlePageSizeChange}
      >
        {!isLoggedIn ? (
          <CallToAction loginText={loginText} actionText={actionText} />
        ) : null}
      </DataGrid>
    </Stack>
  );
};

export default History;
