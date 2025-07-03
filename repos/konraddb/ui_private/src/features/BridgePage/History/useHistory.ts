import { useTranslation } from "next-i18next";

import { RowProps, useFilterGrid } from "@/components/molecules";
import { ModalVariants } from "@/definitions/types";
import {
  bridgeIn,
  changeTab,
  GridTabs,
  OpenRequestGridRow,
  resetSelection,
  selectSelectedTab,
} from "@/features/BridgePage/store";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account";
import { selectStrategy, selectTxFeeDepositAddress } from "@/store/ancillary";
import { selectIsValidLogin, selectNeutralFeatures } from "@/store/auth";
import {
  changeAuxilliaryPageSize,
  openModal,
  selectAuxilliaryPageSize,
  setModalParams,
} from "@/store/ui";
import { evaluate } from "@/utils/logic";

import { BridgeModalViews } from "../BridgeModal";
import {
  selectBridgeHistory,
  selectBridgeInOpenRequests,
} from "../store/bridge.selectors";
import {
  createHistoryColumnConfig,
  createOpenRequestColumnConfig,
  createTabs,
  namespace,
} from "./config";

export const useHistory = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  const isAdmin = useAppSelector(selectIsAdminUser);
  const isBridgeDisabled = !featureFlags.bridge || !isLoggedIn || !isAdmin;
  const openRequestsDataProvider = useAppSelector(selectBridgeInOpenRequests);
  const txFeeDepositAddress = useAppSelector(selectTxFeeDepositAddress);
  const historyDataProvider = useAppSelector(selectBridgeHistory);
  const selectedTab = useAppSelector(selectSelectedTab);
  const strategy = useAppSelector(selectStrategy);
  const tabs = createTabs(t);
  const historyColumns = createHistoryColumnConfig(t);
  const openRequestsColumns = createOpenRequestColumnConfig(
    t,
    isBridgeDisabled
  );
  const pageSize = useAppSelector(selectAuxilliaryPageSize);
  const isHistoryTab = selectedTab === GridTabs.History;
  const rawDataProvider = isHistoryTab
    ? historyDataProvider
    : openRequestsDataProvider;
  const { dataProvider, searchKeyword, setSearchKeyword } = useFilterGrid(
    rawDataProvider as any[]
  );

  const searchTooltip = t(`${namespace}:search`);
  const noContentText = evaluate<string>(
    [!isHistoryTab, t(`${namespace}:noOpenRequests`)],
    [isHistoryTab, t(`${namespace}:noHistory`)]
  );
  const loginText = t(`${namespace}:login`);
  const actionText = evaluate<string>(
    [!isHistoryTab, t(`${namespace}:loginToStartBridging`)],
    [isHistoryTab, t(`${namespace}:loginToReviewHistory`)]
  );

  const handleChangeTab = (_: unknown, value: string) => {
    dispatch(changeTab(value as GridTabs));
  };

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changeAuxilliaryPageSize(pageSize as number));
  };

  const handleCellClick = async (row: RowProps) => {
    dispatch(openModal(ModalVariants.Bridge));
    dispatch(setModalParams(BridgeModalViews.BridgingIn));

    const result = await bridgeIn(
      strategy,
      row as OpenRequestGridRow,
      txFeeDepositAddress
    );

    if (!result) {
      dispatch(setModalParams(BridgeModalViews.BridgeFailed));
      return;
    }

    dispatch(setModalParams(BridgeModalViews.BridgeInSuccess));
    dispatch(resetSelection());
  };

  return {
    tabs,
    selectedTab,
    historyColumns,
    openRequestsColumns,
    dataProvider,
    isLoggedIn,
    searchTooltip,
    noContentText,
    loginText,
    actionText,
    searchKeyword,
    pageSize,
    isHistoryTab,
    setSearchKeyword,
    handleChangeTab,
    handleCellClick,
    handlePageSizeChange,
  };
};
