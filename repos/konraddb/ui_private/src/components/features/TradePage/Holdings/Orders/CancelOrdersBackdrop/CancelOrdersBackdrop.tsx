import { Box } from "@mui/material";

import { Button } from "@/components/atoms";
import { BackdropTitle, Notification } from "@/components/molecules";

import {
  containerStyle,
  notificationStyle,
} from "./CancelOrdersBackdrop.styles";
import { useCancelOrdersBackdrop } from "./useCancelOrdersBackdrop";

const CancelOrdersBackdrop = () => {
  const {
    title,
    subTitle,
    hint,
    cancelOrdersButtonText,
    cancelButtonText,
    disabled,
    handleCloseOrders,
    handleCancel,
  } = useCancelOrdersBackdrop();

  return (
    <Box sx={containerStyle}>
      <BackdropTitle title={title} subtitle={subTitle} />

      <Notification sx={notificationStyle} variant="info" primaryText={hint} />

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={disabled}
        onClick={handleCloseOrders}
      >
        {cancelOrdersButtonText}
      </Button>
      <Button variant="text" size="large" fullWidth onClick={handleCancel}>
        {cancelButtonText}
      </Button>
    </Box>
  );
};

export default CancelOrdersBackdrop;
