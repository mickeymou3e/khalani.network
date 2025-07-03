import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box } from "@mui/material";

import InfoPopover from "./InfoPopover";

export default {
  title: "components/molecules/InfoPopover",
  component: InfoPopover,
} as ComponentMeta<typeof InfoPopover>;

const Template: ComponentStory<typeof InfoPopover> = (args) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100vh"
  >
    <InfoPopover {...args} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  children: "Info Popover. You can place anything here.",
};
