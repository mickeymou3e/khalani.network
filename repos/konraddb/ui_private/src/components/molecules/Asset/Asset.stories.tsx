import { Meta, Story } from "@storybook/react";

import { Asset, AssetProps } from "@/components/molecules";
import {
  BTCAssetMock,
  BTCUSDAssetMock,
  USDAssetMock,
} from "@/definitions/__mocks__";

const AssetStories = (props: AssetProps) => <Asset {...props} />;

const defaultArgs = {
  iconSize: 24,
  LabelProps: {},
};

export default {
  title: "components/molecules/Asset",
  component: AssetStories,
} as Meta<AssetProps>;

const Template: Story<AssetProps> = (args) => (
  <AssetStories {...defaultArgs} {...args} />
);

export const TokenAssets = Template.bind({});
TokenAssets.args = {
  ...defaultArgs,
  assets: [BTCAssetMock, USDAssetMock],
};

export const PairAsset = Template.bind({});
PairAsset.args = {
  ...defaultArgs,
  asset: BTCUSDAssetMock,
  showDescription: true,
};

export const TokenAssetsWithDescription = Template.bind({});
TokenAssetsWithDescription.args = {
  ...defaultArgs,
  assets: [BTCAssetMock, USDAssetMock],
  showDescription: true,
};

export const CurrencyAsset = Template.bind({});
CurrencyAsset.args = {
  ...defaultArgs,
  assets: [USDAssetMock],
};

export const NoAssets = Template.bind({});
NoAssets.args = {
  ...defaultArgs,
};
