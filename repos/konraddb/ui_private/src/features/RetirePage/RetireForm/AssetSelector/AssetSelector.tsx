import { Trans } from "next-i18next";

import { Box, Typography } from "@mui/material";

import { Asset, BasicInfoPopover, SelectBase } from "@/components/molecules";
import { Symbols } from "@/definitions/types";

import DropdownContents from "./DropdownContents";
import { useAssetSelector } from "./useAssetSelector";

type AssetSelectorProps = {
  onChange?: (assetKey: string) => void;
};

const AssetSelector = ({ onChange }: AssetSelectorProps) => {
  const {
    poolTokens,
    energyAttributeTokens,
    selectedAsset,
    selectedAssetBalance,
    popoverActionRef,
    disabled,
    balanceText,
    infoTexts,
    placeholderText,
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
    <BasicInfoPopover disabled={disabled}>
      <Box>
        {infoTexts.map((text) => (
          <Typography
            key={text}
            color="primary.main"
            variant="body2"
            display="inline-block"
            mb={1}
          >
            <Trans>{text}</Trans>
          </Typography>
        ))}
      </Box>
    </BasicInfoPopover>
  );

  return (
    <SelectBase
      disabled={disabled}
      value={selectedAsset?.asset ?? ""}
      placeholder={placeholderText}
      maxHeight={60}
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
        SecondaryLabelProps: { value: balanceText },
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
          eats={energyAttributeTokens}
          pools={poolTokens}
          onSelect={handleAssetChange(onClose)}
          onViewToggle={handleViewToggle}
        />
      )}
    </SelectBase>
  );
};

export default AssetSelector;
