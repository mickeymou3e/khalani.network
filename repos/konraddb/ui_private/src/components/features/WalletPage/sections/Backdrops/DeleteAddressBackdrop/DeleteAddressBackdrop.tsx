import Box from "@mui/material/Box";

import { backdropWrapper } from "./DeleteAddressBackdrop.styles";
import ResultView from "./sections/ResultView";
import VerifyView from "./sections/VerifyView";
import {
  DeleteAddressBackdropViews,
  useDeleteAddressBackdrop,
} from "./useDeleteAddressBackdrop";

const DeleteAddressBackdrop = () => {
  const { view, setView } = useDeleteAddressBackdrop();

  return (
    <Box sx={backdropWrapper}>
      {view === DeleteAddressBackdropViews.Verify && (
        <VerifyView setView={setView} />
      )}
      {(view === DeleteAddressBackdropViews.Success ||
        view === DeleteAddressBackdropViews.Error) && (
        <ResultView isSuccess={view === DeleteAddressBackdropViews.Success} />
      )}
    </Box>
  );
};

export default DeleteAddressBackdrop;
