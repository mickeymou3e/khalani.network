import { Box, Stack } from "@mui/material";

import { Button, TransactionStatusDisplay } from "@/components/atoms";
import { BackdropTitle, Modal } from "@/components/molecules";
import { ModalVariants } from "@/definitions/types";

import {
  buttonStyle,
  containerStyle,
  innerContainerStyle,
  sectionStyle,
} from "./OrderDetailsModal.styles";
import { OrderDetailsRow } from "./OrderDetailsRow";
import { useOrderDetailsModal } from "./useOrderDetailsModal";

const OrderDetailsModal = () => {
  const contents = useOrderDetailsModal();

  return (
    <Modal variant={ModalVariants.OrderDetails}>
      <Stack sx={containerStyle}>
        <BackdropTitle
          title={contents.titleLabel}
          subtitle={contents.subtitleLabel}
        />

        <TransactionStatusDisplay
          status={contents.status!}
          label={contents.statusLabel}
          partial={contents.partial!}
        />

        <Box sx={innerContainerStyle}>
          <Box sx={sectionStyle}>
            <OrderDetailsRow
              label={contents.orderIdLabel}
              value={contents.orderId}
              showButton
            />
            <OrderDetailsRow
              label={contents.createdLabel}
              value={contents.createdDate}
              secondaryValue={contents.createdTime}
            />
            <OrderDetailsRow
              label={contents.finishedLabel}
              value={contents.finishedDate}
              secondaryValue={contents.finishedTime}
            />
            <OrderDetailsRow label={contents.typeLabel} value={contents.type} />
            <OrderDetailsRow
              label={contents.sideLabel}
              value={contents.side}
              side={contents.side}
            />
          </Box>

          <Box sx={sectionStyle}>
            <OrderDetailsRow
              label={contents.amountLabel}
              value={contents.amount}
            />
            <OrderDetailsRow
              label={contents.executedAmountLabel}
              secondaryLabel={contents.partial ? contents.partialFillLabel : ""}
              value={contents.executedAmount}
              secondaryValue={
                contents.partial ? `${contents.filledPercentge}%` : ""
              }
            />
            <OrderDetailsRow
              label={contents.priceLabel}
              value={contents.price}
            />
          </Box>

          <Box sx={sectionStyle}>
            <OrderDetailsRow label={contents.feeLabel} value={contents.fee} />
            <OrderDetailsRow
              label={contents.totalLabel}
              value={contents.total}
            />
          </Box>
        </Box>

        <Button
          sx={buttonStyle}
          variant="contained"
          fullWidth
          onClick={contents.handleCloseClick}
        >
          {contents.closeButtonLabel}
        </Button>
      </Stack>
    </Modal>
  );
};

export default OrderDetailsModal;
