import { ToggleButtonGroup } from "@/components/atoms";
import { EcoAssets } from "@/definitions/types";

import { useEcoAssetToggleGroup } from "./useEcoAssetToggleGroup";

const EcoAssetToggleGroup = () => {
  const { selectedSide, sides, setSide } = useEcoAssetToggleGroup();

  return (
    <ToggleButtonGroup
      currentValue={selectedSide}
      values={sides}
      exclusive
      handleAction={(_, value: string) => setSide(value as EcoAssets)}
    />
  );
};

export default EcoAssetToggleGroup;
