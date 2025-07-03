import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, Typography } from "@mui/material";

import InfoPanel from "./InfoPanel";

export default {
  title: "components/molecules/InfoPanel",
  component: InfoPanel,
} as ComponentMeta<typeof InfoPanel>;

const Template: ComponentStory<typeof InfoPanel> = (args) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100vh"
  >
    <InfoPanel {...args} width={200} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  content: [
    { label: "Label 1", value: "Value 1" },
    { label: "Label 2", value: "Value 2" },
    { label: "Label 3", value: "Value 3" },
  ],
};

export const WithCustomComponent = Template.bind({});
WithCustomComponent.args = {
  content: [
    { label: "Label 1", value: "Value 1" },
    { label: "Label 2", value: "Value 2" },
    {
      label: "Label 3",
      component: (
        <Typography
          sx={{
            padding: "0.25rem 0.5rem",
            backgroundColor: "primary.gray3",
          }}
          variant="caption"
          color="white"
        >
          Value 3
        </Typography>
      ),
    },
  ],
};
