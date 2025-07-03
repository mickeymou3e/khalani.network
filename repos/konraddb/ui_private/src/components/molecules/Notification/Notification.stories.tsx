import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box } from "@mui/material";

import Notification from "./Notification";

export default {
  title: "components/molecules/Notifications",
  component: Notification,
} as ComponentMeta<typeof Notification>;

const Notifications = () => (
  <Box display="flex" flexDirection="column" gap={2}>
    <Notification primaryText="Close position in progress." />
    <Notification primaryText="Something went wrong" variant="error" />
    <Notification primaryText="Position closed" variant="success" />
  </Box>
);

const Template: ComponentStory<typeof Notification> = () => <Notifications />;

export const Default = Template.bind({});
Default.args = {};
