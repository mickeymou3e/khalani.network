import { Stack, Typography } from "@mui/material";

import { SelectionItem } from "@/features/BridgePage/store";

import { AssetEntry } from "../AssetEntry";
import { sectionStyle } from "./DestinationAssets.styles";
import { useDestinationAssets } from "./useDestinationAssets";

const DestinationAssets = () => {
  const { selectionList, isSelectionPopulated, sectionText, creditToRegistry } =
    useDestinationAssets();

  return (
    <Stack gap={2}>
      <Typography variant="subtitle2" color="primary.gray2">
        {sectionText}
      </Typography>
      <Stack sx={sectionStyle} component="ul">
        {isSelectionPopulated &&
          selectionList.map((asset: SelectionItem, idx: number) => (
            <AssetEntry key={idx} asset={asset!} />
          ))}
        {!isSelectionPopulated && <AssetEntry placeholder={creditToRegistry} />}
      </Stack>
    </Stack>
  );
};

export default DestinationAssets;
