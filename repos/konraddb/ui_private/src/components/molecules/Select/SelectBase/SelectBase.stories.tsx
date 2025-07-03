import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, SxProps } from "@mui/material";

import SelectBase, { SelectBaseProps } from "./SelectBase";

const SelectsStories = (props: SelectBaseProps) => {
  const boxStyle: Partial<SxProps> = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    resize: "both",
    overflow: "auto",
    padding: 2,
  };

  const [value, setValue] = useState<string>("select1");

  return (
    <Box sx={boxStyle}>
      <SelectBase {...props} />
      <SelectBase
        {...props}
        value={value}
        setValue={(val) => setValue(val as string)}
      />
      <SelectBase {...props} value="select1" disabled />
    </Box>
  );
};

export default {
  title: "components/molecules/Select/SelectBase",
  component: SelectsStories,
} as ComponentMeta<typeof SelectsStories>;

const Template: ComponentStory<typeof SelectsStories> = (args) => (
  <SelectsStories {...args} />
);

export const Default = Template.bind({});
Default.args = {
  options: ["select1", "select2", "select3", "select4"],
  placeholder: "Select a value",
};

export const WithScrollbar = Template.bind({});
WithScrollbar.args = {
  options: [
    "select1",
    "select2",
    "select3",
    "select4",
    "select11",
    "select21",
    "select31",
    "select41",
    "select12",
    "select22",
    "select32",
    "select42",
  ],
  placeholder: "Select a value",
};
