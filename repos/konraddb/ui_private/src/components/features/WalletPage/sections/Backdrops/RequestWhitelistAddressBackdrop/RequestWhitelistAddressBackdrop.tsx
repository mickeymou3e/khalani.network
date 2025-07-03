import Box from "@mui/material/Box";

import { backdropWrapper } from "./RequestWhitelistAddressBackdrop.styles";
import ErrorView from "./sections/ErrorView";
import MainView from "./sections/MainView";
import SuccessView from "./sections/SuccessView";
import VerifyView from "./sections/VerifyView";
import {
  RequestWhitelistAddressBackdropViews,
  useRequestWhitelistAddressBackdrop,
} from "./useRequestWhitelistAddressBackdrop";

const RequestWhitelistAddressBackdrop = () => {
  const { view, setView, credentials, setCredentials } =
    useRequestWhitelistAddressBackdrop();

  return (
    <Box sx={backdropWrapper}>
      {view === RequestWhitelistAddressBackdropViews.Main && (
        <MainView setView={setView} setCredentials={setCredentials} />
      )}
      {view === RequestWhitelistAddressBackdropViews.Verify && (
        <VerifyView setView={setView} credentials={credentials} />
      )}
      {view === RequestWhitelistAddressBackdropViews.Success && <SuccessView />}
      {view === RequestWhitelistAddressBackdropViews.Error && (
        <ErrorView setView={setView} />
      )}
    </Box>
  );
};

export default RequestWhitelistAddressBackdrop;
