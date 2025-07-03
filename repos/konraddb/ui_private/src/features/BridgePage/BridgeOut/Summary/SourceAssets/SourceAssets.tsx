import AutoModeIcon from "@mui/icons-material/AutoMode";
import { Stack, Typography } from "@mui/material";

import { Button } from "@/components/atoms";

import { AssetEntry } from "../AssetEntry";
import {
  emptyContainerStyle,
  placeholderIconStyle,
  sectionStyle,
} from "./SourceAssets.styles";
import { useSourceAssets } from "./useSourceAssets";

const SourceAssets = () => {
  const {
    selectionList,
    isSelectionPopulated,
    sectionText,
    clearBridgeListText,
    placeholderText,
    handleDeleteClick,
    handleClearList,
  } = useSourceAssets();

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" color="primary.gray2">
          {sectionText}
        </Typography>
        <Button
          size="small"
          variant="translucent"
          disabled={!selectionList.length}
          onClick={handleClearList}
        >
          {clearBridgeListText}
        </Button>
      </Stack>

      {isSelectionPopulated && (
        <Stack sx={sectionStyle} component="ul">
          {selectionList.map((asset: any, idx: any) => (
            <AssetEntry key={idx} asset={asset!} onDelete={handleDeleteClick} />
          ))}
        </Stack>
      )}

      {!isSelectionPopulated && (
        <Stack sx={emptyContainerStyle} spacing="1.5rem">
          <AutoModeIcon sx={placeholderIconStyle} />
          <Typography variant="body2" color="primary.gray2" component="span">
            {placeholderText}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default SourceAssets;
