import { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import InfoPopover from "./InfoPopover";

export default {
  title: "components/molecules/InfoPopover",
  component: InfoPopover,
} as Meta<typeof InfoPopover>;

// Define the template for Storybook v8
type Story = StoryObj<typeof InfoPopover>;

const Template: Story = {
  render: (args) => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <InfoPopover {...args} />
    </Box>
  ),
};

export const Default: Story = {
  ...Template,
  args: {
    children: "Info Popover. You can place anything here.",
  },
};
