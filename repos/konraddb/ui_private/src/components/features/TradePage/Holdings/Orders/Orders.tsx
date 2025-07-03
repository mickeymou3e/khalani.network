import Brightness5OutlinedIcon from "@mui/icons-material/Brightness5Outlined";

import { CallToAction, DataGrid } from "@/components/molecules";
import { iconStyles } from "@/styles/others/muiIconStyles";

import { useOrders } from "./useOrders";

const Orders = () => {
  const {
    isLoggedIn,
    columns,
    noDataText,
    dataProvider,
    loginText,
    actionText,
    pageSize,
    handleCellClick,
    handlePageSizeChange,
  } = useOrders();

  return (
    <DataGrid
      columns={columns}
      dataProvider={dataProvider}
      placeholder={noDataText}
      pageSize={pageSize}
      enableHorizontalScroll
      onCellClick={handleCellClick}
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

export default Orders;
