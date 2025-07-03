import { SelectBase } from "@/components/molecules";

import DropdownContents from "./DropdownContents";
import { usePoolSelector } from "./usePoolSelector";

type PoolSelectorProps = {
  label: string;
  disabled?: boolean;
  onChange?: (poolKey: string) => void;
};

const PoolSelector = ({
  label,
  disabled = false,
  onChange,
}: PoolSelectorProps) => {
  const {
    assets,
    secondaryValue,
    tertiaryValue,
    quaternaryValue,
    popoverActionRef,
    placeholderText,
    selectedPoolKey,
    renderSelectedAsset,
    handleAssetChange,
    handleViewToggle,
  } = usePoolSelector(onChange);

  return (
    <SelectBase
      disabled={disabled || !assets.length}
      value={selectedPoolKey ?? ""}
      placeholder={placeholderText}
      maxHeight={63}
      popoverAnchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      popoverTransformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      popoverAction={popoverActionRef}
      renderValue={renderSelectedAsset}
      TopLabelProps={{
        LabelProps: { value: label },
        SecondaryLabelProps: { value: secondaryValue },
        TertiaryLabelProps: {
          value: tertiaryValue,
        },
        QuaternaryLabelProps: {
          value: quaternaryValue,
        },
      }}
    >
      {(onClose) => (
        <DropdownContents
          data={assets}
          onSelect={handleAssetChange(onClose)}
          onViewToggle={handleViewToggle}
        />
      )}
    </SelectBase>
  );
};

export default PoolSelector;
