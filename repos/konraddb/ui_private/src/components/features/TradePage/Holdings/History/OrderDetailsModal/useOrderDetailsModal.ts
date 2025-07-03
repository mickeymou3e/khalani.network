import { useTranslation } from "next-i18next";

import { ExecutionSide, OrderStatus } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectSettledOrder } from "@/store/orders";
import { closeModal, selectModalProps } from "@/store/ui";
import { evaluate } from "@/utils/logic";

import { namespace } from "../../config";

export const useOrderDetailsModal = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const modalProps = useAppSelector(selectModalProps);
  const orderDetails = useAppSelector(selectSettledOrder(modalProps.params));
  const titleLabel = t(`${namespace}:orderDetail`);
  const subtitleLabel = orderDetails?.pair;
  const statusLabel = orderDetails?.isPartial
    ? t(`common:orderStatuses:partiallyFilled`, {
        partial: orderDetails.filledPercentage,
      })
    : t(`common:orderStatuses:${orderDetails?.status}`);
  const status = orderDetails?.status as OrderStatus;
  const orderIdLabel = t(`${namespace}:orderId`);
  const createdLabel = t(`${namespace}:created`);
  const completedLabel = t(`${namespace}:completed`);
  const cancelledLabel = t(`${namespace}:canceled`);
  const closededLabel = t(`${namespace}:closed`);
  const rejectedLabel = t(`${namespace}:rejected`);
  const typeLabel = t(`${namespace}:type`);
  const sideLabel = t(`${namespace}:side`);
  const priceLabel = t(`${namespace}:price`);
  const amountLabel = t(`${namespace}:amount`);
  const executedAmountLabel = t(`${namespace}:execuded`);
  const totalLabel = t(`${namespace}:total`);
  const feeLabel = t(`${namespace}:fee`);
  const partialFillLabel = t(`${namespace}:partialFill`);
  const closeButtonLabel = t(`${namespace}:close`);
  const type = t(`common:orderTypes:${orderDetails?.type}`);
  const finishedLabel = evaluate(
    [true, rejectedLabel],
    [
      orderDetails?.status === OrderStatus.CANCELLED_PARTIALLY_FILLED,
      closededLabel,
    ],
    [orderDetails?.status === OrderStatus.CANCELLED, cancelledLabel],
    [orderDetails?.status === OrderStatus.FILLED, completedLabel]
  ) as string;

  const handleCloseClick = () => {
    dispatch(closeModal());
  };

  return {
    orderId: orderDetails?.orderId,
    createdDate: orderDetails?.createdDate,
    createdTime: orderDetails?.createdTime,
    finishedDate: orderDetails?.finishedDate,
    finishedTime: orderDetails?.finishedTime,
    type,
    side: orderDetails?.side as ExecutionSide,
    price: orderDetails?.price,
    amount: orderDetails?.initialAmount,
    executedAmount: orderDetails?.executedAmount,
    total: orderDetails?.total,
    fee: orderDetails?.fee,
    partial: orderDetails?.isPartial,
    filledPercentge: orderDetails?.filledPercentage,
    statusLabel,
    status,
    titleLabel,
    subtitleLabel,
    orderIdLabel,
    createdLabel,
    finishedLabel,
    typeLabel,
    sideLabel,
    priceLabel,
    amountLabel,
    executedAmountLabel,
    totalLabel,
    feeLabel,
    partialFillLabel,
    closeButtonLabel,
    handleCloseClick,
  };
};
