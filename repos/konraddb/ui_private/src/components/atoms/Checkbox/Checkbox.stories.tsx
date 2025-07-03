import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Stack from "@mui/material/Stack";

import Checkbox from "./Checkbox";

export default {
  title: "components/atoms/Checkbox",
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const StorybookComponent = ({ label = "" }: { label?: string }) => {
  const [checked, setChecked] = useState(true);

  return (
    <Stack flexDirection="column" gap={2} m={2}>
      <Checkbox
        checked={!checked}
        label={label}
        onChange={() => setChecked(!checked)}
        inputProps={{ "aria-label": "controlled" }}
      />
      <Checkbox
        checked={checked}
        label={label}
        onChange={() => setChecked(!checked)}
        inputProps={{ "aria-label": "controlled" }}
      />
      <Checkbox
        checked={!checked}
        label={label}
        onChange={() => setChecked(!checked)}
        inputProps={{ "aria-label": "controlled" }}
        disabled
      />
      <Checkbox
        checked={checked}
        label={label}
        onChange={() => setChecked(!checked)}
        inputProps={{ "aria-label": "controlled" }}
        disabled
      />
    </Stack>
  );
};

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <StorybookComponent {...args} />
);

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: "Label",
};
