import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, SxProps } from "@mui/material";

import {
  BTCAssetMock,
  ETHAssetMock,
  USDAssetMock,
  USDCAssetMock,
  XRPAssetMock,
} from "@/definitions/__mocks__";

import SimpleSelect, {
  SimpleSelectOption,
  SimpleSelectProps,
} from "./SimpleSelect";

const SelectsStories = ({
  defaultSelection,
  ...rest
}: SimpleSelectProps & { defaultSelection: string }) => {
  const boxStyle: Partial<SxProps> = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    resize: "both",
    overflow: "auto",
    padding: 2,
  };

  const [value, setValue] = useState<string>(defaultSelection);

  return (
    <Box sx={boxStyle}>
      <SimpleSelect
        {...rest}
        value={value}
        setValue={(val) => setValue(val as string)}
      />
      <SimpleSelect {...rest} value={defaultSelection} disabled />
    </Box>
  );
};

export default {
  title: "components/molecules/Select/SimpleSelect",
  component: SelectsStories,
} as ComponentMeta<typeof SelectsStories>;

const Template: ComponentStory<typeof SelectsStories> = (args) => (
  <SelectsStories {...args} />
);

const options: SimpleSelectOption[] = [
  { value: "select1", assets: [BTCAssetMock] },
  { value: "select2", assets: [ETHAssetMock] },
  { value: "select3", assets: [USDCAssetMock] },
];

const additionalOptions: SimpleSelectOption[] = [
  { value: "select4", assets: [USDCAssetMock] },
  { value: "select5", assets: [XRPAssetMock] },
  { value: "select6", assets: [USDAssetMock] },
];

const simpleOptions: SimpleSelectOption[] = [
  { value: "select1", label: "Label 1" },
  { value: "select2", label: "Label 2" },
  { value: "select3", label: "Label 3" },
  { value: "select4", label: "Label 4" },
  { value: "select5", label: "Label 5" },
  { value: "select6", label: "Label 6" },
];

export const Default = Template.bind({});
Default.args = {
  defaultSelection: "select1",
  options,
};

export const WithTopAndBottomLabel = Template.bind({});
WithTopAndBottomLabel.args = {
  defaultSelection: "select1",
  options,
  TopLabelProps: {
    LabelProps: { value: "Top label" },
  },
  BottomLabelProps: {
    LabelProps: { value: "Bottom label" },
  },
};

export const WithSearch = Template.bind({});
WithSearch.args = {
  defaultSelection: "select1",
  options: [...options, ...additionalOptions],
  searchable: true,
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  defaultSelection: "select1",
  options,
  showDescription: true,
};

export const WithScrollbar = Template.bind({});
WithScrollbar.args = {
  defaultSelection: "select1",
  options: [...options, ...additionalOptions],
  searchable: true,
  showDescription: true,
};

export const WithSimpleLabel = Template.bind({});
WithSimpleLabel.args = {
  defaultSelection: "select1",
  options: simpleOptions,
  searchable: true,
};
