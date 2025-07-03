import { Box, Stack } from "@mui/material";

import { SubpageHeader } from "@/components/molecules";
import useRetirePage from "@/features/RetirePage/useRetirePage";

import { History } from "./History";
import { RetireForm } from "./RetireForm";
import { RetireModal } from "./RetireModal";
import { actionAreaContainerStyles, rootStyles } from "./RetirePage.styles";
import { SelectedAssets } from "./SelectedAssets";

const RetirePage = () => {
  const { title } = useRetirePage();

  return (
    <Stack sx={rootStyles}>
      <SubpageHeader title={title} />
      <Box sx={actionAreaContainerStyles}>
        <RetireForm />
        <SelectedAssets />
      </Box>

      <History />

      <RetireModal />
    </Stack>
  );
};

export default RetirePage;
