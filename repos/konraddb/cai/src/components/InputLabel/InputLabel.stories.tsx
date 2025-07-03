import { Meta, StoryObj } from "@storybook/react";
import { InputLabel as NeutralInputLabel } from "./InputLabel";

export default {
  title: "components/molecules/Input/InputLabel",
  component: NeutralInputLabel,
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
} as Meta<typeof NeutralInputLabel>;

// Define the template for Storybook v8
type Story = StoryObj<typeof NeutralInputLabel>;

export const InputLabel: Story = {
  render: (args) => <NeutralInputLabel {...args} />,
  args: {
    LabelProps: {
      value: "Input Label",
    },
  },
};

export const WithErrorState: Story = {
  render: (args) => <NeutralInputLabel {...args} />,
  args: {
    LabelProps: {
      value: "Input Label",
    },
    error: true,
  },
};

export const WithSecondaryLabel: Story = {
  render: (args) => <NeutralInputLabel {...args} />,
  args: {
    LabelProps: {
      value: "Input Label",
    },
    SecondaryLabelProps: {
      value: "Secondary Label",
    },
  },
};

export const AllLabels: Story = {
  render: (args) => <NeutralInputLabel {...args} />,
  args: {
    LabelProps: {
      value: "Input Label",
    },
    SecondaryLabelProps: {
      value: "Secondary Label",
    },
    TertiaryLabelProps: {
      value: "Tertiary Label",
    },
  },
};
