import { alpha, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

import { colorify } from "@/styles/overrides/utils";

export const inputOverrides = (theme: Theme): Partial<OverridesStyleRules> => {
  const { main, gray2, gray3 } = theme.palette.primary;
  const { red } = theme.palette.alert;
  const { _3percent, _10percent } = theme.custom.opacity;

  return {
    styleOverrides: {
      root: {
        ...colorify(main, main, _3percent),
        "&.MuiOutlinedInput-root": {
          borderRadius: "1rem",
          "&:not(.Mui-error)": {
            "& fieldset.MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(main, _10percent),
            },
          },
          "&.Mui-disabled": {
            backgroundColor: "transparent",
            "& fieldset.MuiOutlinedInput-notchedOutline": {
              ...colorify(gray3, main, _3percent),
            },
            "& img": {
              opacity: 0.6,
            },
            "& .MuiInputAdornment-root .MuiTypography-root": {
              color: gray3,
            },
          },
          "&.Mui-focused:not(.Mui-error)": {
            "& fieldset.MuiOutlinedInput-notchedOutline": {
              border: `1px solid ${main}`,
              backgroundColor: "transparent",
            },
          },
          "&.Mui-error": {
            "& .MuiOutlinedInput-input": {
              color: red,
            },
            "& fieldset.MuiOutlinedInput-notchedOutline": {
              border: `1px solid ${red}`,
            },
          },
          "&.MuiInputBase-adornedStart": {
            paddingLeft: theme.spacing(2),
          },
          "& .MuiInputAdornment-positionEnd > .MuiTypography-root": {
            color: main,
            paddingLeft: theme.spacing(2),
          },
          "& .MuiOutlinedInput-input": {
            fontWeight: 300,
            fontSize: "1rem",
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            "&::placeholder": {
              color: gray2,
              opacity: 1,
            },
            "&:autofill": {
              transition: "background-color 0s ease-in-out 10000s",
            },
            "&.Mui-disabled": {
              WebkitTextFillColor: "unset",
              color: gray3,
              backgroundColor: "transparent",
              "& .MuiTypography-root": {
                color: gray3,
                backgroundColor: "transparent",
              },
            },
          },
        },
        "& .MuiSelect-outlined": {
          "& .MuiTypography-root": {
            fontWeight: 300,
          },
        },
      },
    },
  };
};
