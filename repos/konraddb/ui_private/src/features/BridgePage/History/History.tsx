import { Stack } from "@mui/material";

import { ToggleButtonGroup } from "@/components/atoms";
import { CallToAction, DataGrid, SearchInput } from "@/components/molecules";

import { searchInputStyle } from "./History.styles";
import { useHistory } from "./useHistory";

const History = () => {
  const {
    tabs,
    selectedTab,
    historyColumns,
    openRequestsColumns,
    dataProvider,
    searchTooltip,
    noContentText,
    isLoggedIn,
    loginText,
    actionText,
    searchKeyword,
    pageSize,
    isHistoryTab,
    setSearchKeyword,
    handleChangeTab,
    handleCellClick,
    handlePageSizeChange,
  } = useHistory();

  const callToAction = !isLoggedIn ? (
    <CallToAction loginText={loginText} actionText={actionText} />
  ) : null;

  const dataGrid = (columns: any[]) => (
    <DataGrid
      columns={columns}
      dataProvider={dataProvider}
      placeholder={noContentText}
      pageSize={pageSize}
      enableHorizontalScroll
      onPageSizeChange={handlePageSizeChange}
      onCellClick={handleCellClick}
    >
      {callToAction}
    </DataGrid>
  );

  return (
    <Stack spacing="1.5rem">
      <Stack direction="row" justifyContent="space-between">
        <ToggleButtonGroup
          currentValue={selectedTab}
          values={tabs}
          exclusive
          handleAction={handleChangeTab}
          size="medium"
        />
        <SearchInput
          sx={searchInputStyle}
          value={searchKeyword}
          size="small"
          disabled={false}
          placeholder={searchTooltip}
          setValue={setSearchKeyword}
        />
      </Stack>

      {!isHistoryTab && dataGrid(openRequestsColumns)}
      {isHistoryTab && dataGrid(historyColumns)}
    </Stack>
  );
};

export default History;
