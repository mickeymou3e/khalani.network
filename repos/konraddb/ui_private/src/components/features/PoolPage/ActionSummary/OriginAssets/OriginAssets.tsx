import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import { Stack, Typography } from "@mui/material";

import { Button } from "@/components/atoms";
import { PoolMode } from "@/store/pool";

import { AssetEntry } from "../AssetEntry";
import {
  containerStyle,
  emptyContainerStyle,
  placeholderIconStyle,
} from "./OriginAssets.styles";
import { useOriginAssets } from "./useOriginAssets";

export type OriginAssetsProps = {
  type: PoolMode;
  namespace: string;
};

const OriginAssets = (props: OriginAssetsProps) => {
  const {
    selectionList,
    assetsExist,
    isDepositAction,
    titleText,
    clearPoolText,
    placeholderText,
    handleDeleteClick,
    handleClearList,
  } = useOriginAssets(props);

  const ListIcon = isDepositAction ? WaterDropOutlinedIcon : SpaOutlinedIcon;

  return (
    <Stack gap="1rem">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" color="primary.gray2">
          {titleText}
        </Typography>
        <Button
          size="small"
          variant="translucent"
          disabled={!assetsExist}
          onClick={handleClearList}
        >
          {clearPoolText}
        </Button>
      </Stack>

      {assetsExist && (
        <Stack sx={containerStyle} component="ul">
          {selectionList.map((asset, idx) => (
            <AssetEntry key={idx} asset={asset!} onDelete={handleDeleteClick} />
          ))}
        </Stack>
      )}

      {!assetsExist && (
        <Stack sx={emptyContainerStyle} spacing="1.5rem">
          <ListIcon sx={placeholderIconStyle} />
          <Typography variant="body2" color="primary.gray2" component="span">
            {placeholderText}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default OriginAssets;
