import { alpha, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

import { colorify } from "@/styles/overrides/utils";

export const buttonOverrides = (theme: Theme): Partial<OverridesStyleRules> => {
  const { main, accent, gray3, buttonText, background } = theme.palette.primary;
  const { black } = theme.palette.common;
  const { green, red } = theme.palette.alert;
  const { _60percent, _10percent, _5percent, _3percent } = theme.custom.opacity;

  return {
    styleOverrides: {
      root: {
        textTransform: "uppercase",
        boxShadow: "none",
        whiteSpace: "no-wrap",
        minWidth: "max-content",
        fontWeight: "500",
        border: "none",
        "&:hover": {
          boxShadow: "none",
          border: "none",
        },
        "&:disabled": {
          border: "none",
        },
      },
      sizeLarge: {
        fontSize: "1rem",
        height: "4rem",
        padding: "1.25rem 2rem",
        borderRadius: "2rem",
      },
      sizeMedium: {
        fontSize: "0.875rem",
        height: "3rem",
        padding: "0.875rem 1.5rem",
        borderRadius: "1.5rem",
      },
      sizeSmall: {
        fontSize: "0.75rem",
        height: "2rem",
        padding: "0.5rem 1.25rem",
        borderRadius: "1rem",
      },
      // TODO: use that sizes for mobile
      // sizeLarge: {
      //   fontSize: "0.875rem",
      //   height: "3.25rem",
      //   padding: "0rem 2rem",
      //   borderRadius: "2rem",
      // },
      // sizeMedium: {
      //   fontSize: "0.75rem",
      //   height: "2.5rem",
      //   padding: "0rem 1.5rem",
      //   borderRadius: "2rem",
      // },
      // sizeSmall: {
      //   fontSize: "0.625rem",
      //   height: "2rem",
      //   padding: "0rem 1rem",
      //   borderRadius: "2rem",
      // },
      containedPrimary: {
        ...colorify(buttonText, main),
        "&:hover": {
          ...colorify(buttonText, main, _60percent),
        },
        "&:disabled": {
          ...colorify(gray3, main, _5percent),
        },
      },
      containedSuccess: {
        ...colorify(buttonText, accent, _60percent),
        "&:disabled": {
          ...colorify(buttonText, accent, _60percent),
        },
      },
      containedSecondary: {
        ...colorify(gray3, alpha(main, 0.05)),
        "&:hover": {
          ...colorify(buttonText, main, _60percent),
        },
        "&:disabled": {
          ...colorify(gray3, main, _5percent),
        },
      },
      translucentPrimary: {
        ...colorify(main, main, _5percent),
        "&:hover": {
          ...colorify(main, main, _10percent),
        },
        "&:disabled": {
          ...colorify(gray3, main, _3percent),
        },
      },
      translucentSuccess: {
        ...colorify(accent, accent, _10percent),
        "&:disabled": {
          ...colorify(accent, accent, _10percent),
        },
      },
      outlinedPrimary: {
        ...colorify(main, background, _5percent),
        border: `1px solid ${alpha(main, _10percent)}`,
        "&:hover": {
          border: `1px solid ${alpha(main, _10percent)}`,
          ...colorify(main, main, _10percent),
        },
        "&:disabled": {
          border: `1px solid ${alpha(main, _10percent)}`,
          ...colorify(gray3, main, _3percent),
        },
      },
      outlinedSuccess: {
        ...colorify(accent, accent, _5percent),
        border: `1px solid ${alpha(accent, _10percent)}`,
        "&:disabled": {
          ...colorify(accent, accent, _5percent),
          border: `1px solid ${alpha(accent, _10percent)}`,
        },
      },
      textPrimary: {
        ...colorify(main, "transparent"),
        "&:hover": {
          ...colorify(main, main, _3percent),
        },
        "&:disabled": {
          ...colorify(gray3, "transparent"),
        },
      },
      textSuccess: {
        ...colorify(accent, accent, _5percent),
        "&:disabled": {
          ...colorify(accent, accent, _5percent),
        },
      },
    },
    variants: [
      {
        props: {
          variant: "long" as const,
        },
        style: {
          ...colorify(black, green),
          "&:hover": {
            ...colorify(black, green, _60percent),
          },
          "&:disabled": {
            ...colorify(gray3, main, _5percent),
          },
        },
      },
      {
        props: {
          variant: "short" as const,
        },
        style: {
          ...colorify(black, red),
          "&:hover": {
            ...colorify(black, red, _60percent),
          },
          "&:disabled": {
            ...colorify(gray3, main, _5percent),
          },
        },
      },
    ],
  };
};
