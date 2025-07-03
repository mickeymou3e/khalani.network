import { EnergySavingsLeafOutlined } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";

import { Button } from "@/components/atoms";
import { Notification } from "@/components/molecules";

import { AssetEntry } from "./AssetEntry";
import {
  containerStyle,
  emptyContainerStyle,
  placeholderIconStyle,
} from "./SelectedAssets.styles";
import { useSelectedAssets } from "./useSelectedAssets";

const SelectedAssets = () => {
  const {
    selectionList,
    assetsExist,
    titleText,
    sectionText,
    clearRetireListText,
    placeholderText,
    actionText,
    summaryDescriptionBold,
    summaryDescription,
    handleDeleteClick,
    handleClearList,
    handleRetireClick,
  } = useSelectedAssets();

  return (
    <Stack gap={6} flex={1}>
      <Typography
        variant="subtitle2"
        color="primary.main"
        textTransform="uppercase"
      >
        {titleText}
      </Typography>

      <Stack gap={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2" color="primary.gray2">
            {sectionText}
          </Typography>
          <Button
            size="small"
            variant="translucent"
            disabled={!assetsExist}
            onClick={handleClearList}
          >
            {clearRetireListText}
          </Button>
        </Stack>

        {assetsExist && (
          <Stack sx={containerStyle} component="ul">
            {selectionList.map((asset: any, idx: any) => (
              <AssetEntry
                key={idx}
                asset={asset!}
                onDelete={handleDeleteClick}
              />
            ))}
          </Stack>
        )}

        {!assetsExist && (
          <Stack sx={emptyContainerStyle} spacing="1.5rem">
            <EnergySavingsLeafOutlined sx={placeholderIconStyle} />
            <Typography variant="body2" color="primary.gray2" component="span">
              {placeholderText}
            </Typography>
          </Stack>
        )}
      </Stack>

      {assetsExist && (
        <Notification
          variant="info"
          customChildren={
            <Box>
              <Typography variant="body3" fontWeight="bold" display="inline">
                {summaryDescriptionBold}
              </Typography>
              <Typography variant="body3" ml={0.5} display="inline">
                {summaryDescription}
              </Typography>
            </Box>
          }
        />
      )}

      <Button
        disabled={!assetsExist}
        variant="contained"
        size="large"
        fullWidth
        onClick={handleRetireClick}
      >
        {actionText}
      </Button>
    </Stack>
  );
};

export default SelectedAssets;
