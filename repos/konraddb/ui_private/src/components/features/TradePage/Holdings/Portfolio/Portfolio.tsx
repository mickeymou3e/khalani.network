import Brightness5OutlinedIcon from "@mui/icons-material/Brightness5Outlined";

import { CallToAction, DataGrid } from "@/components/molecules";
import { iconStyles } from "@/styles/others/muiIconStyles";

import { usePortfolio } from "./usePortfolio";

const Portfolio = () => {
  const {
    isLoggedIn,
    columns,
    dataProvider,
    noDataText,
    loginText,
    actionText,
    pageSize,
    handlePageSizeChange,
  } = usePortfolio();

  return (
    <DataGrid
      columns={columns}
      dataProvider={dataProvider}
      placeholder={noDataText}
      pageSize={pageSize}
      enableHorizontalScroll
      onPageSizeChange={handlePageSizeChange}
      collapseHeader={!isLoggedIn}
    >
      {!isLoggedIn ? (
        <CallToAction
          loginText={loginText}
          actionText={actionText}
          iconComponent={<Brightness5OutlinedIcon sx={iconStyles()} />}
        />
      ) : null}
    </DataGrid>
  );
};

export default Portfolio;
