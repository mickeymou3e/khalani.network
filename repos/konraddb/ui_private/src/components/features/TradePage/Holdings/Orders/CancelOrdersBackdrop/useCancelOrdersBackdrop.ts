import { useState } from "react";
import { useTranslation } from "next-i18next";

import { useCancelOrderMutation } from "@/services/orders/orders.api";
import { useAppDispatch, useAppSelector } from "@/store";
import { hideBackdrop, selectBackdropParams } from "@/store/backdrops";

import { namespace } from "../../config";

export const useCancelOrdersBackdrop = () => {
  const [disabled, setDisabled] = useState(false);
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const [cancelOrder] = useCancelOrderMutation();
  const orderId = useAppSelector(selectBackdropParams);

  const title = t(`${namespace}:cancelTitle`);
  const subTitle = t(`${namespace}:cancelSubtitle`);
  const hint = t(`${namespace}:cancelHint`);
  const cancelOrdersButtonText = t(`${namespace}:cancelOrdersButton`);
  const cancelButtonText = t(`${namespace}:cancelButton`);

  const handleCloseOrders = async () => {
    setDisabled(true);

    await cancelOrder(orderId);

    setDisabled(false);
    dispatch(hideBackdrop());
  };

  const handleCancel = () => {
    dispatch(hideBackdrop());
  };

  return {
    title,
    subTitle,
    hint,
    cancelOrdersButtonText,
    cancelButtonText,
    disabled,
    handleCloseOrders,
    handleCancel,
  };
};
