import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Box from "@mui/material/Box";

import NeutralSlider from "./NeutralSlider";

export default {
  title: "components/atoms/NeutralSlider",
  component: NeutralSlider,
} as ComponentMeta<typeof NeutralSlider>;

const Sliders = () => {
  const [sliderValue, setSliderValue] = useState<number | number[]>(50);
  return (
    <Box width="400px">
      <NeutralSlider
        aria-label="Amount"
        step={1}
        onChange={(_, value: number | number[]) => {
          setSliderValue(value);
        }}
        value={sliderValue}
        valueLabelDisplay="off"
      />
    </Box>
  );
};

const Template: ComponentStory<typeof NeutralSlider> = () => <Sliders />;

export const Default = Template.bind({});
Default.args = {};
