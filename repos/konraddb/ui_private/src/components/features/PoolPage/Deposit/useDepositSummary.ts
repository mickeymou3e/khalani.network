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
import { pool } from "./Deposit.helpers";

export const useDepositSummary = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);
  const poolTokenDepositAddress = useAppSelector(selectPoolTokenDepositAddress);
  const txFeeDepositAddress = useAppSelector(selectTxFeeDepositAddress);
  const strategy = useAppSelector(selectStrategy);
  const assetsSelectionExists = useAppSelector(selectAssetsSelectionExists);
  const selectionList = useAppSelector(selectSelectionList);

  const buttonText = t(`${namespace}:execute`);
  const summaryLabel = t(`${namespace}:summary:summary`);

  const handlePoolAction = async () => {
    dispatch(openModal(ModalVariants.PoolRedeem));
    dispatch(setModalParams(PoolRedeemModalViews.PoolLoading));

    const result = await pool({
      strategy,
      poolTokenDepositAddress,
      txFeeDepositAddress,
      selectionList,
    });

    if (!result) {
      dispatch(setModalParams(PoolRedeemModalViews.PoolFailed));
      return;
    }

    dispatch(setModalParams(PoolRedeemModalViews.PoolSuccess));
    dispatch(resetSelection());
  };

  return {
    buttonText,
    summaryLabel,
    assetsSelectionExists,
    handlePoolAction,
  };
};
