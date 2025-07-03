import { FormikProps } from "formik";

import { Box, Stack, Typography } from "@mui/material";

import { Fees, Notification } from "@/components/molecules";
import {
  FiatCurrencies,
  NotificationPropsVariant,
  Symbols,
} from "@/definitions/types";

import { OrderFormProps } from "../Contents.types";
import { InfoPopover } from "./InfoPopover";
import {
  containerStyle,
  contentStyle,
  innerContentStyle,
  notificationStyle,
  topContainerStyle,
} from "./TransactionDetails.styles";
import { useTransactionDetails } from "./useTransactionDetails";

export type TransactionDetailsProps = {
  total: number;
  minAmount: number;
  marketPrice: number;
  isLimit: boolean;
  isBuySide: boolean;
  formik: FormikProps<OrderFormProps>;
};

const TransactionDetails = (props: TransactionDetailsProps) => {
  const {
    shouldShowNotification,
    notificationVariant,
    notificationText,
    marketPriceText,
    feeText,
    totalText,
    transactionDetailsText,
    priceLabelText,
    feeLabelText,
    totalLabelText,
  } = useTransactionDetails(props);

  return (
    <Box sx={topContainerStyle}>
      <Box sx={contentStyle}>
        <Typography variant="inputLabel" color="primary.gray2">
          {transactionDetailsText}
        </Typography>
        <InfoPopover />
      </Box>

      <Box sx={containerStyle}>
        <Box sx={contentStyle}>
          <Typography variant="body2">{priceLabelText}</Typography>
          <Box sx={innerContentStyle}>
            <Typography variant="body2" fontWeight="bold">
              {marketPriceText}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {FiatCurrencies.EUR}
            </Typography>
          </Box>
        </Box>
        <Fees
          feeLabel={feeLabelText}
          fee={feeText}
          discountFee={Symbols.ZeroBalance}
        />
        <Box sx={contentStyle}>
          <Typography variant="body2">{totalLabelText}</Typography>
          <Stack direction="row" gap={1.5}>
            <Typography variant="body2" fontWeight="bold">
              {totalText}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {FiatCurrencies.EUR}
            </Typography>
          </Stack>
        </Box>
      </Box>
      {shouldShowNotification && (
        <Box sx={notificationStyle}>
          <Notification
            primaryText={notificationText}
            variant={notificationVariant as NotificationPropsVariant}
          />
        </Box>
      )}
    </Box>
  );
};

export default TransactionDetails;
