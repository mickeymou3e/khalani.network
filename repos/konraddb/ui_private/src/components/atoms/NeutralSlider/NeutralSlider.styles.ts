import { Theme } from "@mui/material";

export const sliderStyles =
  (value: number, sliderMarksLength: number, disabled?: boolean) =>
  (theme: Theme) => {
    const activeMark = Math.floor(Number(value) / 25);

    const { main, gray2, gray3 } = theme.palette.primary;
    const { primary } = theme.palette.text;
    const { _3percent } = theme.custom.opacity;

    return {
      margin: 0,
      padding: 0,

      "& .MuiSlider-markLabel": {
        fontSize: "0.75rem",
        lineHeight: "180%",
        top: "1.5rem",

        '&[data-index="0"]': {
          paddingLeft: "4px",
          color: activeMark === 0 && main,
        },
        [`&[data-index="${sliderMarksLength - 1}"]`]: {
          paddingRight: "8px",
          color: activeMark === sliderMarksLength - 1 && main,
        },
      },
      [`.MuiSlider-markLabel[data-index="${activeMark}"]`]: {
        color: disabled ? gray2 : main,
      },

      "& .MuiSlider-rail, & .MuiSlider-track": {
        opacity: Number(value) * 0.004 + _3percent,
      },

      "& .MuiSlider-thumb": {
        "&.Mui-disabled": {
          color: gray3,
        },
      },

      "& .MuiSlider-valueLabel": {
        fontSize: "0.75rem",
        lineHeight: "180%",
        fontWeight: "700",
        backgroundColor: "unset",
        color: disabled ? gray3 : primary,
        top: "-0.5rem",
        padding: 0,
        paddingLeft: "2px",
      },
    };
  };

export const sliderWrapper = () => ({
  height: "84px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 0.5rem",
});
