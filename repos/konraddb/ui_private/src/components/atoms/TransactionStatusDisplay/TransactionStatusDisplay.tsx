import { Box, Typography } from "@mui/material";

import { BridgeStatus, OrderStatus, TxStatus } from "@/definitions/types";
import { evaluate } from "@/utils/logic";

import {
  bridgeStatusContainerStyle,
  orderStatusContainerStyle,
  txStatusContainerStyle,
} from "./TransactionStatus.styles";

export type TransactionStatusDisplayProps = {
  status: OrderStatus | TxStatus | BridgeStatus;
  label: string;
  partial?: boolean;
  percent?: number;
  small?: boolean;
};

const TransactionStatusDisplay = ({
  status,
  label,
  partial = false,
  percent = 0,
  small = false,
}: TransactionStatusDisplayProps) => {
  const isOrderStatus = Object.values(OrderStatus).includes(
    status as OrderStatus
  );
  const isTxStatus = Object.values(TxStatus).includes(status as TxStatus);
  const style = evaluate(
    [true, bridgeStatusContainerStyle(status as BridgeStatus, small)],
    [
      isOrderStatus,
      orderStatusContainerStyle(status as OrderStatus, partial, percent, small),
    ],
    [isTxStatus, txStatusContainerStyle(status as TxStatus, small)]
  );

  return (
    <Box sx={style}>
      <Typography variant={small ? "body2" : "body1"}>{label}</Typography>
    </Box>
  );
};

export default TransactionStatusDisplay;
