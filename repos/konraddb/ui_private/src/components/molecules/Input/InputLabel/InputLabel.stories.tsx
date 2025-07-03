import { ComponentMeta, ComponentStory } from "@storybook/react";

import { InputLabel as NeutralInputLabel } from "./InputLabel";

export default {
  title: "components/molecules/Input/InputLabel",
  component: NeutralInputLabel,
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
} as ComponentMeta<typeof NeutralInputLabel>;

const Template: ComponentStory<typeof NeutralInputLabel> = (args) => (
  <NeutralInputLabel {...args} />
);

export const InputLabel = Template.bind({});
InputLabel.args = {
  LabelProps: {
    value: "Input Label",
  },
};

export const WithErrorState = Template.bind({});
WithErrorState.args = {
  LabelProps: {
    value: "Input Label",
  },
  error: true,
};

export const WithSecondaryLabel = Template.bind({});
WithSecondaryLabel.args = {
  LabelProps: {
    value: "Input Label",
  },
  SecondaryLabelProps: {
    value: "Secondary Label",
  },
};

export const AllLabels = Template.bind({});
AllLabels.args = {
  LabelProps: {
    value: "Input Label",
  },
  SecondaryLabelProps: {
    value: "Secondary Label",
  },
  TertiaryLabelProps: {
    value: "Tertiary Label",
  },
};
