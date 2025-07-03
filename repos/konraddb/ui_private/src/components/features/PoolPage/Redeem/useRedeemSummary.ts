import { useTranslation } from "next-i18next";

import { ModalVariants } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectPoolTokenDepositAddress,
  selectStrategy,
  selectTxFeeDepositAddress,
} from "@/store/ancillary";
import { resetSelection } from "@/store/pool";
import { openModal, setModalParams } from "@/store/ui";

import { PoolRedeemModalViews } from "../PoolRedeemModal";
import {
  selectAssetsSelectionExists,
  selectSelectionList,
} from "../store/pool.selectors";
import { namespace } from "./config";
import { redeem } from "./Redeem.helpers";

export const useRedeemSummary = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const assetsSelectionExists = useAppSelector(selectAssetsSelectionExists);
  const txFeeDepositAddress = useAppSelector(selectTxFeeDepositAddress);
  const poolTokenDepositAddress = useAppSelector(selectPoolTokenDepositAddress);
  const strategy = useAppSelector(selectStrategy);
  const selectionList = useAppSelector(selectSelectionList);

  const buttonText = t(`${namespace}:execute`);
  const summaryLabel = t(`${namespace}:summary:summary`);

  const handleRedeemAction = async () => {
    dispatch(openModal(ModalVariants.PoolRedeem));
    dispatch(setModalParams(PoolRedeemModalViews.RedeemLoading));

    const result = await redeem({
      strategy,
      poolTokenDepositAddress,
      txFeeDepositAddress,
      selectionList,
    });

    if (!result) {
      dispatch(setModalParams(PoolRedeemModalViews.RedeemFailed));
      return;
    }

    dispatch(setModalParams(PoolRedeemModalViews.RedeemSuccess));
    dispatch(resetSelection());
  };

  return {
    buttonText,
    summaryLabel,
    assetsSelectionExists,
    handleRedeemAction,
  };
};
