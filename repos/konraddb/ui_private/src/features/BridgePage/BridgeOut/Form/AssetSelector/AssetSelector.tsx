import { Asset, BasicInfoPopover, SelectBase } from "@/components/molecules";
import { Symbols } from "@/definitions/types";

import DropdownContents from "./DropdownContents";
import { useAssetSelector } from "./useAssetSelector";

type AssetSelectorProps = {
  onChange?: (assetKey: string) => void;
};

const AssetSelector = ({ onChange }: AssetSelectorProps) => {
  const {
    energyAttributeTokens,
    selectedAsset,
    selectedAssetBalance,
    isBridgeEnabled,
    popoverActionRef,
    availableText,
    infoText,
    selectAssetPlaceholder,
    selectLabel,
    assetInfoText,
    handleAssetChange,
    handleViewToggle,
  } = useAssetSelector(onChange);

  const tertiaryValue = selectedAssetBalance?.balance ?? Symbols.NoBalance;

  const renderSelectedAsset = selectedAsset
    ? () => (
        <Asset
          asset={{ label: selectedAsset.asset, icon: selectedAsset.icon }}
          showDescription={false}
        />
      )
    : undefined;
  const quaternaryValue = (
    <BasicInfoPopover disabled={!energyAttributeTokens.length}>
      {infoText}
    </BasicInfoPopover>
  );

  return (
    <SelectBase
      disabled={!energyAttributeTokens.length || !isBridgeEnabled}
      value={selectedAsset?.asset ?? ""}
      placeholder={selectAssetPlaceholder}
      maxHeight={52}
      popoverAnchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      popoverTransformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      popoverAction={popoverActionRef}
      renderValue={renderSelectedAsset}
      TopLabelProps={{
        LabelProps: { value: selectLabel },
        SecondaryLabelProps: { value: availableText },
        TertiaryLabelProps: {
          value: tertiaryValue,
        },
        QuaternaryLabelProps: {
          value: quaternaryValue,
        },
      }}
      BottomLabelProps={{
        LabelProps: { value: assetInfoText },
      }}
    >
      {(onClose) => (
        <DropdownContents
          data={energyAttributeTokens}
          onSelect={handleAssetChange(onClose)}
          onViewToggle={handleViewToggle}
        />
      )}
    </SelectBase>
  );
};

export default AssetSelector;
