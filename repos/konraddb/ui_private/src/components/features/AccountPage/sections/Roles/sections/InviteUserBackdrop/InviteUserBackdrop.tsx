import Box from "@mui/material/Box";

import { backdropWrapper } from "./InviteUserBackdrop.styles";
import ErrorView from "./sections/ErrorView";
import MainView from "./sections/MainView";
import SuccessView from "./sections/SuccessView";
import {
  InviteUserBackdropViews,
  useInviteUserBackdrop,
} from "./useInviteUserBackdrop";

const InviteUserBackdrop = () => {
  const { view, setView } = useInviteUserBackdrop();

  return (
    <Box sx={backdropWrapper}>
      {view === InviteUserBackdropViews.Main && <MainView setView={setView} />}
      {view === InviteUserBackdropViews.Success && <SuccessView />}
      {view === InviteUserBackdropViews.Error && (
        <ErrorView supportDisclaimer setView={setView} />
      )}
    </Box>
  );
};

export default InviteUserBackdrop;
