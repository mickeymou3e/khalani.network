import { ToggleButtonGroup } from "@/components/atoms";

import { toggleButtonStyles } from "./Header.styles";
import useHeader from "./useHeader";

const Header = () => {
  const { sides, selectedSide, handleToggleChange } = useHeader();

  return (
    <ToggleButtonGroup
      sx={toggleButtonStyles}
      currentValue={selectedSide}
      values={sides}
      exclusive
      handleAction={handleToggleChange}
    />
  );
};

export default Header;
