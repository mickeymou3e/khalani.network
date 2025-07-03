import Box from "@mui/material/Box";

import { backdropWrapper } from "./LoginBackdrop.styles";
import BlockedView from "./sections/BlockedView";
import MainView from "./sections/MainView";
import VerifyView from "./sections/VerifyView";
import {
  LoginBackdropViews,
  useLoginBackdropContents,
} from "./useLoginBackdropContents";

const LoginBackdrop = () => {
  const { view, setView, handleResetPassword } = useLoginBackdropContents();

  return (
    <Box sx={backdropWrapper}>
      {view === LoginBackdropViews.Main && <MainView setView={setView} />}
      {view === LoginBackdropViews.Verify && <VerifyView setView={setView} />}
      {view === LoginBackdropViews.Block && (
        <BlockedView handleResetPassword={handleResetPassword} />
      )}
    </Box>
  );
};

export default LoginBackdrop;
