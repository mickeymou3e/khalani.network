import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, SxProps } from "@mui/material";

import { Button } from "@/components/atoms";
import { BTCAssetMock } from "@/definitions/__mocks__";

import InputBase from "./InputBase";
import { InputBaseProps } from "./types";

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
export default {
  title: "components/molecules/Input/InputBase",
  component: InputsStories,
} as ComponentMeta<typeof InputsStories>;

const Template: ComponentStory<typeof InputsStories> = (args) => (
  <InputsStories {...args} />
);

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

export const InputAlone = Template.bind({});
InputAlone.args = {};

export const InputWithProducts = Template.bind({});
InputWithProducts.args = {
  assets: [BTCAssetMock],
};

export const InputWithTrailingText = Template.bind({});
InputWithTrailingText.args = {
  trailingText: "USD",
};

export const InputWithEndAdornment = Template.bind({});
InputWithEndAdornment.args = {
  InputProps: {
    endAdornment: (
      <Button variant="outlined" size="small">
        Max
      </Button>
    ),
  },
};

export const InputWithTopLabel = Template.bind({});
InputWithTopLabel.args = {
  TopLabelProps: labelProps,
};

export const InputWithBottomLabel = Template.bind({});
InputWithBottomLabel.args = {
  BottomLabelProps: labelProps,
};

export const TextArea = Template.bind({});
TextArea.args = {
  multiline: true,
  rows: 4,
};
