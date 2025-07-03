import { FormikProps } from "formik";

import { SelectBase } from "@/components/molecules";

import DropdownContents from "./DropdownContents";
import { useAssetSelector } from "./useAssetSelector";

type AssetSelectorProps = {
  formik: FormikProps<any>;
  onChange?: (assetKey: string) => void;
};

const AssetSelector = ({ formik, onChange }: AssetSelectorProps) => {
  const {
    assets,
    primaryValue,
    secondaryValue,
    tertiaryValue,
    quaternaryValue,
    popoverActionRef,
    placeholderText,
    assetInfoTextValue,
    renderSelectedAsset,
    handleAssetChange,
    handleViewToggle,
  } = useAssetSelector(formik, onChange);

  return (
    <SelectBase
      value={formik.values.withdrawalAsset}
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
        LabelProps: { value: primaryValue },
        SecondaryLabelProps: { value: secondaryValue },
        TertiaryLabelProps: {
          value: tertiaryValue,
        },
        QuaternaryLabelProps: {
          value: quaternaryValue,
        },
      }}
      BottomLabelProps={{
        LabelProps: { value: assetInfoTextValue },
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

export default AssetSelector;
