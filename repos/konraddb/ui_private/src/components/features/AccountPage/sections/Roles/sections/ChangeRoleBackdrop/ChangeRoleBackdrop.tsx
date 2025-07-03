import Box from "@mui/material/Box";

import { backdropWrapper } from "./ChangeRoleBackdrop.styles";
import MainView from "./sections/MainView";
import SuccessView from "./sections/SuccessView";
import VerifyView from "./sections/VerifyView";
import {
  ChangeRoleBackdroppViews,
  useChangeRoleBackdrop,
} from "./useChangeRoleBackdrop";

const ChangeRoleBackdrop = () => {
  const { view, setView, setCredentials } = useChangeRoleBackdrop();

  return (
    <Box sx={backdropWrapper}>
      {view === ChangeRoleBackdroppViews.Main && (
        <MainView setView={setView} setCredentials={setCredentials} />
      )}
      {view === ChangeRoleBackdroppViews.Verify && (
        <VerifyView setView={setView} />
      )}
      {view === ChangeRoleBackdroppViews.Success && <SuccessView />}
    </Box>
  );
};

export default ChangeRoleBackdrop;
