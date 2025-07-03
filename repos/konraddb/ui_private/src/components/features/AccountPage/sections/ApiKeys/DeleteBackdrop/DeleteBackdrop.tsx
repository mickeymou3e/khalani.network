import Box from "@mui/material/Box";

import { backdropWrapper } from "./DeleteBackdrop.styles";
import SuccessView from "./sections/SuccessView";
import VerifyView from "./sections/VerifyView";
import WarningView from "./sections/WarningView";
import { DeleteBackdropViews, useDeleteBackdrop } from "./useDeleteBackdrop";

const DeleteBackdrop = () => {
  const { view, setView, handleCloseBackdrop } = useDeleteBackdrop();

  return (
    <Box sx={backdropWrapper}>
      {view === DeleteBackdropViews.Warning && (
        <WarningView
          setView={setView}
          handleCloseBackdrop={handleCloseBackdrop}
        />
      )}
      {view === DeleteBackdropViews.Verify && <VerifyView setView={setView} />}
      {view === DeleteBackdropViews.Success && <SuccessView />}
    </Box>
  );
};

export default DeleteBackdrop;
