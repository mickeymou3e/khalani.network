import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box } from "@mui/material";
import { styled } from "@mui/system";

import { StaticRoutes } from "@/definitions/config";

import { BaseAsset } from "./BaseAsset";
import { BaseAssetProps } from "./types";

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  resize: "both",
  overflow: "auto",
});

const BaseAssetStories = (props: BaseAssetProps) => (
  <StyledContainer>
    <BaseAsset {...props} />
  </StyledContainer>
);

export default {
  title: "components/molecules/Asset/BaseAsset",
  component: BaseAssetStories,
} as ComponentMeta<typeof BaseAssetStories>;

const singleAsset = (withLabel = true, withIcon = true) => ({
  assets: [
    {
      icon: withIcon ? `${StaticRoutes.ASSET_ICONS}/btc.svg` : undefined,
      label: withLabel ? "BTC" : undefined,
      description: withLabel ? "Bitcoin" : undefined,
    },
  ],
  iconSize: 24,
});

const pairAssets = (withLabel = true, withIcon = true) => ({
  assets: [
    {
      icon: withIcon ? `${StaticRoutes.ASSET_ICONS}/btc.svg` : undefined,
      label: withLabel ? "BTC" : undefined,
      description: withLabel ? "Bitcoin" : undefined,
    },
    {
      icon: withIcon ? `${StaticRoutes.ASSET_ICONS}/eth.svg` : undefined,
      label: withLabel ? "ETH" : undefined,
      description: withLabel ? "Ethereum" : undefined,
    },
  ],
  iconSize: 24,
});

const Template: ComponentStory<typeof BaseAsset> = (args) => (
  <BaseAssetStories {...args} />
);

export const SingleAsset = Template.bind({});
SingleAsset.args = singleAsset();

export const SingleAssetWithOverrideLabel = Template.bind({});
SingleAssetWithOverrideLabel.args = {
  ...singleAsset(true),
  label: "Single Asset",
};

export const SingleAssetWithoutLabel = Template.bind({});
SingleAssetWithoutLabel.args = singleAsset(false);

export const SingleAssetWithoutIcon = Template.bind({});
SingleAssetWithoutIcon.args = singleAsset(true, false);

export const PairAssets = Template.bind({});
PairAssets.args = pairAssets();

export const PairAssetsWithDescription = Template.bind({});
PairAssetsWithDescription.args = {
  ...pairAssets(),
  showDescription: true,
};

export const PairAssetsWithOverrideLabel = Template.bind({});
PairAssetsWithOverrideLabel.args = { ...pairAssets(), label: "Pair Assets" };

export const PairAssetsWithoutLabel = Template.bind({});
PairAssetsWithoutLabel.args = pairAssets(false);

export const PairAssetCustomSize = Template.bind({});
PairAssetCustomSize.args = {
  ...pairAssets(),
  iconSize: 48,
  LabelProps: {
    variant: "h6",
  },
};
