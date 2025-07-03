import { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { StatusAsset } from "./StatusAsset";
import { StatusAssetProps } from "./types";

const StyledContainer = styled(Box)({
  width: 300,
});

const StatusAssetStories = (props: StatusAssetProps) => (
  <StyledContainer>
    <StatusAsset {...props} />
  </StyledContainer>
);

export default {
  title: "components/molecules/Asset/StatusAsset",
  component: StatusAssetStories,
} as Meta<typeof StatusAssetStories>;

const singleAsset = () => ({
  label: "Mom",
  description: "0xDa15bBfC5543e4f903f9aeDA13D296E0d29FDaF6",
});

// Define the template for Storybook v8
type Story = StoryObj<StatusAssetProps>;

export const SingleAsset: Story = {
  render: (args) => <StatusAssetStories {...args} />,
  args: singleAsset(),
};
