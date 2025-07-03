import { createTheme as createMuiTheme, PaletteMode } from "@mui/material";

import { appBarOverrides } from "@/styles/overrides/appbar";
import { toggleButtonOverrides } from "@/styles/overrides/toggleButton";
import { toggleButtonGroupOverrides } from "@/styles/overrides/toggleButtonGroup";
import { toolbarOverrides } from "@/styles/overrides/toolbar";

import { paletteOptions, typographyOptions } from "./options";
import {
  buttonOverrides,
  cssBaselineOverrides,
  typographyOverrides,
} from "./overrides";
import { checkboxOverrides } from "./overrides/checkbox";
import { chipOverrides } from "./overrides/chip";
import { inputOverrides } from "./overrides/input";
import { inputAdornmentOverrides } from "./overrides/inputAdornment";
import { inputLabelOverrides } from "./overrides/inputLabel";
import { outlinedInputOverrides } from "./overrides/outlinedInput";
import { paginationOverrides } from "./overrides/pagination";
import { sliderOverrides } from "./overrides/slider";
import { switchOverrides } from "./overrides/switch";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      opacity: {
        _3percent: number;
        _5percent: number;
        _10percent: number;
        _15percent: number;
        _20percent: number;
        _40percent: number;
        _60percent: number;
        _70percent: number;
        _80percent: number;
      };
    };
  }

  interface ThemeOptions {
    custom: {
      opacity?: {
        _3percent?: number;
        _5percent?: number;
        _10percent?: number;
        _15percent?: number;
        _20percent?: number;
        _40percent?: number;
        _60percent?: number;
        _70percent?: number;
        _80percent?: number;
      };
    };
  }

  interface Palette {
    alert: {
      blue: string;
      green: string;
      red: string;
      orange: string;
    };
    custom: {
      shadow: string;
    };
  }

  interface PaletteOptions {
    alert?: {
      blue?: string;
      green?: string;
      red?: string;
    };
    custom?: {
      shadow?: string;
    };
  }

  interface PaletteColor {
    accent: string;
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    background: string;
    gridHeader: string;
    backgroundGradient: string;
    buttonText: string;
  }

  interface SimplePaletteColorOptions {
    accent?: string;
    gray1?: string;
    gray2?: string;
    gray3?: string;
    gray4?: string;
    background?: string;
    gridHeader?: string;
    backgroundGradient?: string;
    buttonText?: string;
  }

  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }

  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobilePortrait: true;
    mobileLandscape: true;
    tabletPortrait: true;
    tabletLandscape: true;
    smallDesktop: true;
    largeDesktop: true;
    extendedDesktop: true;
    fullHd: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    subtitle: true;
    body3: true;
    buttonLarge: true;
    buttonMedium: true;
    buttonSmall: true;
    inputLabel: true;
    inputText: true;
    helperText: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    long: true;
    short: true;
    translucent: true;
  }
}

export const createTheme = (mode: PaletteMode, fontFamily: string) => {
  const baseTheme = createMuiTheme({
    palette: {
      mode,
      ...paletteOptions[mode],
    },
    custom: {
      opacity: {
        _3percent: 0.03,
        _5percent: 0.05,
        _10percent: 0.1,
        _15percent: 0.15,
        _20percent: 0.2,
        _40percent: 0.4,
        _60percent: 0.6,
        _70percent: 0.6,
        _80percent: 0.8,
      },
    },
    breakpoints: {
      values: {
        mobilePortrait: 600,
        mobileLandscape: 900,
        tabletPortrait: 1024,
        tabletLandscape: 1280,
        smallDesktop: 1440,
        largeDesktop: 1536,
        extendedDesktop: 1600,
        fullHd: 1920,
      },
    },
  });

  return createMuiTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      background: {
        default: baseTheme.palette.primary.background,
      },
    },
    typography: typographyOptions(baseTheme, fontFamily),
    components: {
      MuiAppBar: appBarOverrides(),
      MuiCssBaseline: cssBaselineOverrides(baseTheme, fontFamily),
      MuiButton: buttonOverrides(baseTheme),
      MuiInputBase: inputOverrides(baseTheme),
      MuiInputLabel: inputLabelOverrides(baseTheme),
      MuiOutlinedInput: outlinedInputOverrides(baseTheme),
      MuiInputAdornment: inputAdornmentOverrides(baseTheme),
      MuiTypography: typographyOverrides(baseTheme),
      MuiSlider: sliderOverrides(baseTheme),
      MuiToolbar: toolbarOverrides(baseTheme),
      MuiToggleButton: toggleButtonOverrides(baseTheme),
      MuiToggleButtonGroup: toggleButtonGroupOverrides(),
      MuiSwitch: switchOverrides(baseTheme),
      MuiCheckbox: checkboxOverrides(baseTheme),
      MuiChip: chipOverrides(baseTheme),
      MuiPagination: paginationOverrides(baseTheme),
    },
  });
};
