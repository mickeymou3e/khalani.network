import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";

import { DataGridWithControls } from "@/components/molecules";
import { iconStyles } from "@/styles/others/muiIconStyles";

import { namespace } from "../../config";
import { useWalletWithdrawalTranslations } from "../../useWalletWithdrawalTranslations";
import { useWithdrawHistory } from "./useWithdrawHistory";

const WithdrawHistory = () => {
  const { withdrawHistory, noHistoryYet } =
    useWalletWithdrawalTranslations(namespace);

  const { dataProvider, columnConfig, pageSize, handlePageSizeChange } =
    useWithdrawHistory();

  return (
    <DataGridWithControls
      datagridLabel={withdrawHistory}
      columnConfig={columnConfig}
      dataProvider={dataProvider}
      onPageSizeChange={handlePageSizeChange}
      listLength={pageSize}
      emptyGridPlaceholder={noHistoryYet}
      emptyGridPlaceholderIcon={<ForestOutlinedIcon sx={iconStyles()} />}
    />
  );
};

export default WithdrawHistory;
