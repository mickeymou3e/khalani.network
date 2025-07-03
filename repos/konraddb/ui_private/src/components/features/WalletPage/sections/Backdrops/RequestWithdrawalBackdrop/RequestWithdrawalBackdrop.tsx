import Box from "@mui/material/Box";

import { backdropWrapper } from "./RequestWithdrawalBackdrop.styles";
import ErrorView from "./sections/ErrorView";
import SuccessView from "./sections/SuccessView";
import VerifyView from "./sections/VerifyView";
import {
  RequestWithdrawalBackdropViews,
  useRequestWithdrawalBackdrop,
} from "./useRequestWithdrawalBackdrop";

const RequestWithdrawalBackdrop = () => {
  const { view, setView } = useRequestWithdrawalBackdrop();

  return (
    <Box sx={backdropWrapper}>
      {view === RequestWithdrawalBackdropViews.Verify && (
        <VerifyView setView={setView} />
      )}
      {view === RequestWithdrawalBackdropViews.Success && <SuccessView />}
      {view === RequestWithdrawalBackdropViews.Error && (
        <ErrorView setView={setView} />
      )}
    </Box>
  );
};

export default RequestWithdrawalBackdrop;
