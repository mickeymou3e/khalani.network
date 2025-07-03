import { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

import { BaseAsset } from "./BaseAsset";
import { BaseAssetProps } from "./types";
import { StaticRoutes } from "@/types/routes";

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
} as Meta<typeof BaseAssetStories>;

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

// Define the template for Storybook v8
type Story = StoryObj<BaseAssetProps>;

export const SingleAsset: Story = {
  render: (args) => <BaseAssetStories {...args} />,
  args: singleAsset(),
};

export const SingleAssetWithOverrideLabel: Story = {
  render: (args) => <BaseAssetStories {...args} />,
  args: {
    ...singleAsset(true),
    label: "Single Asset",
  },
};

export const SingleAssetWithoutLabel: Story = {
  render: (args) => <BaseAssetStories {...args} />,
  args: singleAsset(false),
};

export const SingleAssetWithoutIcon: Story = {
  render: (args) => <BaseAssetStories {...args} />,
  args: singleAsset(true, false),
};

export const PairAssets: Story = {
  render: (args) => <BaseAssetStories {...args} />,
  args: pairAssets(),
};

export const PairAssetsWithDescription: Story = {
  render: (args) => <BaseAssetStories {...args} />,
  args: {
    ...pairAssets(),
    showDescription: true,
  },
};

export const PairAssetsWithOverrideLabel: Story = {
  render: (args) => <BaseAssetStories {...args} />,
  args: { ...pairAssets(), label: "Pair Assets" },
};

export const PairAssetsWithoutLabel: Story = {
  render: (args) => <BaseAssetStories {...args} />,
  args: pairAssets(false),
};

export const PairAssetCustomSize: Story = {
  render: (args) => <BaseAssetStories {...args} />,
  args: {
    ...pairAssets(),
    iconSize: 48,
    LabelProps: {
      variant: "h6",
    },
  },
};
