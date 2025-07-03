import { useTranslation } from "next-i18next";

import { ModalVariants } from "@/definitions/types";
import {
  bridgeOut,
  resetSelection,
  selectIsSelectionListPopulated,
  selectSelectionList,
} from "@/features/BridgePage/store";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectStrategy, selectTxFeeDepositAddress } from "@/store/ancillary";
import { openModal, setModalParams } from "@/store/ui";

import { BridgeModalViews } from "../../BridgeModal";

export const namespace = "bridge-page:bridgeOut:summary";

export const useSummary = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isSelectionPopulated = useAppSelector(selectIsSelectionListPopulated);
  const txFeeDepositAddress = useAppSelector(selectTxFeeDepositAddress);
  const selectionList = useAppSelector(selectSelectionList);
  const strategy = useAppSelector(selectStrategy);
  const titleText = t(`${namespace}:title`);
  const actionText = t(`${namespace}:bridgeOut`);
  const summaryDescription = t(`${namespace}:summaryDescription`);

  const handleBridgeOutClick = async () => {
    dispatch(openModal(ModalVariants.Bridge));
    dispatch(setModalParams(BridgeModalViews.BridgingOut));

    const result = await bridgeOut({
      strategy,
      selectionList,
      txFeeDepositAddress,
    });

    if (result) {
      dispatch(setModalParams(BridgeModalViews.BridgeOutSuccess));
      dispatch(resetSelection());
      return;
    }

    dispatch(setModalParams(BridgeModalViews.BridgeFailed));
  };

  return {
    isSelectionPopulated,
    titleText,
    actionText,
    summaryDescription,
    handleBridgeOutClick,
  };
};
