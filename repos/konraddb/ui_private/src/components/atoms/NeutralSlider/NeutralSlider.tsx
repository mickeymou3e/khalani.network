import { Box, Slider, SliderProps } from "@mui/material";

import { formatPercentage } from "@/utils/formatters";

import { sliderStyles, sliderWrapper } from "./NeutralSlider.styles";

const sliderValues = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

const NeutralSlider = ({ value, disabled, ...rest }: SliderProps) => (
  <Box sx={sliderWrapper}>
    <Slider
      sx={sliderStyles(value as number, sliderValues.length, disabled)}
      marks={sliderValues}
      min={sliderValues[0].value}
      max={sliderValues[sliderValues.length - 1].value}
      value={value}
      valueLabelDisplay="on"
      valueLabelFormat={formatPercentage(value as number)}
      disabled={disabled}
      {...rest}
    />
  </Box>
);

export default NeutralSlider;
