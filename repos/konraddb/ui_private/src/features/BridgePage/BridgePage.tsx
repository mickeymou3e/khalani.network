import { Stack } from "@mui/material";

import { ToggleButtonGroup } from "@/components/atoms";
import { SubpageHeader } from "@/components/molecules";

import { BridgeIn } from "./BridgeIn";
import { BridgeModal } from "./BridgeModal";
import { BridgeOut } from "./BridgeOut";
import { rootStyles } from "./BridgePage.styles";
import { BridgeMode } from "./BridgePage.types";
import { History } from "./History";
import useBridgePage from "./useBridgePage";

const BridgePage = () => {
  const { title, description, modes, mode, isBridgeIn, handleModeChange } =
    useBridgePage();

  const naviagtionItems = (
    <ToggleButtonGroup
      currentValue={mode}
      values={modes}
      exclusive
      handleAction={(_, value) => handleModeChange(value as BridgeMode)}
      fullWidth
    />
  );

  return (
    <Stack sx={rootStyles}>
      <SubpageHeader title={title} subtitle={description} />
      {isBridgeIn && <BridgeIn>{naviagtionItems}</BridgeIn>}
      {!isBridgeIn && <BridgeOut>{naviagtionItems}</BridgeOut>}

      <History />

      <BridgeModal />
    </Stack>
  );
};

export default BridgePage;
