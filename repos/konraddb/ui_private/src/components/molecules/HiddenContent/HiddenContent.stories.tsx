import { ComponentMeta, ComponentStory } from "@storybook/react";

import Box from "@mui/material/Box";

import HiddenContent from "./HiddenContent";

export default {
  title: "components/molecules/HiddenContent",
  component: HiddenContent,
} as ComponentMeta<typeof HiddenContent>;

const Template: ComponentStory<typeof HiddenContent> = (args) => {
  const { label, height, icon } = args;

  return (
    <Box mx="auto" width="25rem">
      <HiddenContent label={label} height={height} icon={icon} />
    </Box>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Select option",
  height: "15rem",
};
// ------------------------------------------------------------
export const QrCodeWrapper = Template.bind({});
QrCodeWrapper.args = {
  label: "Select a network to reveal the QR code",
  height: "15rem",
  icon: "CODE",
};
