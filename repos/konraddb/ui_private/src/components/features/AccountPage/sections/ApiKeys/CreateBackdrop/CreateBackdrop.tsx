import Box from "@mui/material/Box";

import { backdropWrapper } from "./CreateBackdrop.styles";
import MainView from "./sections/MainView/MainView";
import SuccessView from "./sections/SuccessView/SuccessView";
import { CreateBackdropViews, useCreateBackdrop } from "./useCreateBackdrop";

interface CreateBackdropViewsProps {
  initialView?: CreateBackdropViews;
}

const CreateNewApiKeyBackdrop = ({ initialView }: CreateBackdropViewsProps) => {
  const { view, setView } = useCreateBackdrop(initialView);

  return (
    <Box sx={backdropWrapper}>
      {view === CreateBackdropViews.Main && <MainView setView={setView} />}
      {view === CreateBackdropViews.Success && <SuccessView />}
    </Box>
  );
};

export default CreateNewApiKeyBackdrop;
