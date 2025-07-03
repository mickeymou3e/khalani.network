import { DataGridWithControls } from "@/components/molecules";

import { namespace } from "../../config";
import { useWalletDepositsTranslations } from "../../useWalletDepositsTranslations";
import { useDepositHistory } from "./useDepositHistory";

const DepositHistory = () => {
  const { depositHistory, noHistoryYet } =
    useWalletDepositsTranslations(namespace);

  const { dataProvider, columnConfig, pageSize, handlePageSizeChange } =
    useDepositHistory();

  return (
    <DataGridWithControls
      datagridLabel={depositHistory}
      columnConfig={columnConfig}
      dataProvider={dataProvider}
      onPageSizeChange={handlePageSizeChange}
      listLength={pageSize}
      emptyGridPlaceholder={noHistoryYet}
    />
  );
};

export default DepositHistory;
