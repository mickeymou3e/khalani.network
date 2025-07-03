import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box } from "@mui/material";

import { SnackbarVariant } from "@/definitions/types";

import Snackbar from "./Snackbar";

export default {
  title: "components/molecules/Snackbars",
  component: Snackbar,
} as ComponentMeta<typeof Snackbar>;

const Snackbars = () => (
  <Box display="flex" flexDirection="column" gap={2}>
    <Snackbar
      primaryText="Close position in progress."
      secondaryText="test"
      link="http://localhost:3000/"
    />
    <Snackbar
      primaryText="Something went wrong"
      secondaryText="test"
      link="http://localhost:3000/"
      variant={SnackbarVariant.error}
    />
    <Snackbar
      primaryText="Position closed"
      secondaryText="test"
      link="http://localhost:3000/"
      variant={SnackbarVariant.success}
    />
  </Box>
);

const Template: ComponentStory<typeof Snackbar> = () => <Snackbars />;

export const Default = Template.bind({});
Default.args = {};
