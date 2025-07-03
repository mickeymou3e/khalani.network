import { ComponentMeta, ComponentStory } from "@storybook/react";

import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";

export default {
  title: "components/atoms/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>;

const StorybookComponent = () => (
  <Box display="flex" flexDirection="column" gap={2} m={2}>
    <Box display="flex" gap={2}>
      disabled: false | checked: true
      <Switch checked inputProps={{ "aria-label": "controlled" }} />
    </Box>
    <Box display="flex" gap={2}>
      disabled: false | checked: false
      <Switch checked={false} inputProps={{ "aria-label": "controlled" }} />
    </Box>

    <Box display="flex" gap={2}>
      disabled: true | checked: true
      <Switch checked inputProps={{ "aria-label": "controlled" }} disabled />
    </Box>
    <Box display="flex" gap={2}>
      disabled: true | checked: false
      <Switch
        checked={false}
        inputProps={{ "aria-label": "controlled" }}
        disabled
      />
    </Box>
  </Box>
);

const Template: ComponentStory<typeof Switch> = () => <StorybookComponent />;

export const Default = Template.bind({});
Default.args = {};
