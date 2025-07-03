import { Meta, StoryObj } from "@storybook/react";
import { Box, SxProps } from "@mui/material";
import InputBase from "./InputBase";
import { InputBaseProps } from "./types";
import { Button } from "../Button";

const BTCAssetMock = { label: "BTC", description: "Bitcoin" };

const InputsStories = (props: InputBaseProps) => {
  const boxStyle: Partial<SxProps> = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    resize: "both",
    overflow: "auto",
    padding: 2,
  };

  return (
    <Box sx={boxStyle}>
      <InputBase value="Input text" {...props} />
      <InputBase placeholder="Placeholder text" {...props} />
      <InputBase value="Disabled text" {...props} disabled />
      <InputBase value="Error text" {...props} error />
    </Box>
  );
};

// Storybook v8 Meta definition
export default {
  title: "components/molecules/Input/InputBase",
  component: InputsStories,
} as Meta<typeof InputsStories>;

// Define the template for Storybook v8
type Story = StoryObj<InputBaseProps>;

const labelProps = {
  LabelProps: {
    value: "Input Label",
  },
  SecondaryLabelProps: {
    value: "Secondary Label",
  },
  TertiaryLabelProps: {
    value: "Tertiary Label",
  },
  QuaternaryLabelProps: {
    value: "Quaternary Label",
  },
};

// Story definitions
export const InputAlone: Story = {
  render: (args) => <InputsStories {...args} />,
};

export const InputWithProducts: Story = {
  render: (args) => <InputsStories {...args} />,
  args: {
    assets: [BTCAssetMock],
  },
};

export const InputWithTrailingText: Story = {
  render: (args) => <InputsStories {...args} />,
  args: {
    trailingText: "USD",
  },
};

export const InputWithEndAdornment: Story = {
  render: (args) => <InputsStories {...args} />,
  args: {
    InputProps: {
      endAdornment: (
        <Button variant="outlined" size="small">
          Max
        </Button>
      ),
    },
  },
};

export const InputWithTopLabel: Story = {
  render: (args) => <InputsStories {...args} />,
  args: {
    TopLabelProps: labelProps,
  },
};

export const InputWithBottomLabel: Story = {
  render: (args) => <InputsStories {...args} />,
  args: {
    BottomLabelProps: labelProps,
  },
};

export const TextArea: Story = {
  render: (args) => <InputsStories {...args} />,
  args: {
    multiline: true,
    rows: 4,
  },
};
