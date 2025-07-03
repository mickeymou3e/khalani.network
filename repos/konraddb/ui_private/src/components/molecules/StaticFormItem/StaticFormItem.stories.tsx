import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, Stack, Typography } from "@mui/material";

import StaticFormItem from "./StaticFormItem";

export default {
  title: "components/molecules/StaticFormItem",
  component: StaticFormItem,
} as ComponentMeta<typeof StaticFormItem>;

const Template: ComponentStory<typeof StaticFormItem> = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100vh"
  >
    <Stack gap={2}>
      <StaticFormItem
        width={300}
        label="Form label"
        placeholder="Placeholder text"
      />
      <StaticFormItem width={300} label="Form label" text="Content text" />
      <StaticFormItem width={300} label="Form label">
        <Stack>
          <Typography color="alert.red">This is a custom child</Typography>
        </Stack>
      </StaticFormItem>
      <StaticFormItem
        width={300}
        label="Form label"
        text="With info text"
        popoverChildren={
          <Typography>This is a custom content within this popover</Typography>
        }
      />
      <StaticFormItem
        width={300}
        label="Form label"
        asset={{
          asset: {
            icon: "btc",
            label: "Bitcoin",
          },
        }}
      />
    </Stack>
  </Box>
);

export const Default = Template.bind({});
Default.args = {};
