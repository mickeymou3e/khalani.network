import Typography from "@mui/material/Typography";

import { Asset, BaseAssetEntry, StatusAsset } from "@/components/molecules";

import { simpleMenuItemsStyle } from "./SimpleSelect.styles";

interface SelectionItemProps {
  label?: string;
  assets?: BaseAssetEntry[];
  showDescription?: boolean;
  type?: "address";
  value?: string;
  selected?: boolean;
}

export const SelectionItem = ({
  label,
  assets,
  showDescription = false,
  type,
  selected = false,
}: SelectionItemProps) => {
  if (label)
    return <Typography sx={simpleMenuItemsStyle(true)}>{label}</Typography>;

  if (!assets) return null;

  if (type === "address")
    return (
      <StatusAsset
        label={assets[0].label}
        description={assets[0].description}
        state={assets[0].state}
        selected={selected}
      />
    );

  return <Asset assets={assets} showDescription={showDescription} />;
};
