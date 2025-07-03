import Brightness5OutlinedIcon from "@mui/icons-material/Brightness5Outlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";

import { Button } from "@/components/atoms";
import { CallToAction, DataGridWithPagination } from "@/components/molecules";
import { iconStyles } from "@/styles/others/muiIconStyles";

import { downloadIconStyle } from "./History.styles";
import { useHistory } from "./useHistory";

const History = () => {
  const {
    isLoggedIn,
    isAdmin,
    columns,
    noDataText,
    dataProvider,
    loginText,
    actionText,
    csvText,
    pageSize,
    handleSaveCSVClick,
    handleCellClick,
    handlePageSizeChange,
  } = useHistory();

  const endAdornment =
    isAdmin || !isLoggedIn ? (
      <Button
        disabled={!isLoggedIn}
        startIcon={<CloudDownloadOutlinedIcon sx={downloadIconStyle} />}
        variant="translucent"
        onClick={handleSaveCSVClick}
      >
        {csvText}
      </Button>
    ) : null;

  const gridChildren = !isLoggedIn ? (
    <CallToAction
      loginText={loginText}
      actionText={actionText}
      iconComponent={<Brightness5OutlinedIcon sx={iconStyles()} />}
    />
  ) : null;

  return (
    <DataGridWithPagination
      columns={columns}
      dataProvider={dataProvider}
      placeholder={noDataText}
      pageSize={pageSize}
      enableHorizontalScroll
      onCellClick={handleCellClick}
      onPageSizeChange={handlePageSizeChange}
      collapseHeader={!isLoggedIn}
      endAdornment={endAdornment}
    >
      {gridChildren}
    </DataGridWithPagination>
  );
};

export default History;
