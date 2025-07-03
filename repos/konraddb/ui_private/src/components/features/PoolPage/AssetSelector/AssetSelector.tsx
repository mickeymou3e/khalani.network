import { Asset, BasicInfoPopover, SelectBase } from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { PoolMode } from "@/store/pool";

import { StatsPopover } from "../StatsPopover";
import DropdownContents from "./DropdownContents";
import { useAssetSelector } from "./useAssetSelector";

type AssetSelectorProps = {
  label: string;
  action: PoolMode;
  disabled?: boolean;
  onChange?: (assetKey: string) => void;
};

const AssetSelector = ({
  label,
  action,
  disabled = false,
  onChange,
}: AssetSelectorProps) => {
  const {
    assets,
    selectedAsset,
    selectedPoolDepositAssetBalances,
    popoverActionRef,
    isRedeem,
    balanceText,
    infoText,
    maxAmountText,
    placeholderText,
    assetInfoText,
    handleAssetChange,
    handleViewToggle,
  } = useAssetSelector(action, onChange);

  const secondaryValue = isRedeem ? maxAmountText : balanceText;
  const tertiaryValue = isRedeem
    ? selectedPoolDepositAssetBalances.balance
    : selectedAsset?.balance ?? Symbols.NoBalance;
  const quaternaryValue = isRedeem ? (
    <StatsPopover disabled={disabled} />
  ) : (
    <BasicInfoPopover disabled={disabled}>{infoText}</BasicInfoPopover>
  );
  const assetInfoTextValue = isRedeem ? "" : assetInfoText;
  const renderSelectedAsset = selectedAsset
    ? () => (
        <Asset
          asset={{ label: selectedAsset.generator, icon: selectedAsset.icon }}
          showDescription={false}
        />
      )
    : undefined;

  return (
    <SelectBase
      disabled={disabled || !assets.length}
      value={selectedAsset?.generator ?? ""}
      placeholder={placeholderText}
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
        LabelProps: { value: label },
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
          isRedeem={isRedeem}
          onSelect={handleAssetChange(onClose)}
          onViewToggle={handleViewToggle}
        />
      )}
    </SelectBase>
  );
};

export default AssetSelector;
