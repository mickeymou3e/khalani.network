import { alpha, Theme } from "@mui/material";

import { BridgeStatus, OrderStatus, TxStatus } from "@/definitions/types";
import { evaluate } from "@/utils/logic";

const commonStyles = (theme: Theme, color: string, small: boolean) => ({
  display: "flex",
  position: "relative",
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(color, theme.custom.opacity._10percent),
  width: "fit-content",
  padding: small ? "0.25rem 0.5rem" : "0.5rem 0.75rem",
  borderRadius: "0.5rem",

  "& .MuiTypography-root": {
    color,
  },
});

export const orderStatusContainerStyle =
  (status: OrderStatus, partial: boolean, percent: number, small: boolean) =>
  (theme: Theme) => {
    const textColor = evaluate(
      [true, theme.palette.alert.red],
      [status === OrderStatus.FILLED, theme.palette.alert.green],
      [
        [OrderStatus.INITIATED, OrderStatus.OPEN].includes(status),
        theme.palette.primary.gray2,
      ],
      [partial, theme.palette.alert.blue]
    ) as string;

    return {
      ...commonStyles(theme, textColor, small),

      "&:after": {
        content: '" "',
        display: "block",
        position: "absolute",
        top: "0",
        left: "0",
        width: `${percent}%`,
        height: "100%",
        backgroundColor: alpha(
          theme.palette.alert.blue,
          theme.custom.opacity._15percent
        ),
      },
    };
  };

export const txStatusContainerStyle =
  (status: TxStatus, small: boolean) => (theme: Theme) => {
    const textColor = evaluate(
      [true, theme.palette.alert.red],
      [status === TxStatus.COMPLETED, theme.palette.alert.green],
      [status === TxStatus.PENDING, theme.palette.primary.gray2]
    ) as string;

    return commonStyles(theme, textColor, small);
  };

export const bridgeStatusContainerStyle =
  (status: BridgeStatus, small: boolean) => (theme: Theme) => {
    const textColor = evaluate(
      [true, theme.palette.alert.red],
      [status === BridgeStatus.IN_PROGRESS, theme.palette.alert.blue],
      [
        [BridgeStatus.READY_TO_BRIDGE, BridgeStatus.COMPLETED].includes(status),
        theme.palette.alert.green,
      ]
    ) as string;

    return commonStyles(theme, textColor, small);
  };
