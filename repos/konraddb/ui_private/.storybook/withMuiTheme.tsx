import { CssBaseline, ThemeProvider } from "@mui/material";
import { DecoratorFn } from "@storybook/react";

import { ThemeModes } from "@/definitions/types";
import { createTheme } from "@/styles";

import "flag-icons/css/flag-icons.min.css";

const fontName = "Inter";

export const darkTheme = createTheme(ThemeModes.dark, fontName);
export const lightTheme = createTheme(ThemeModes.light, fontName);

export const withMuiTheme: DecoratorFn = (Story, { globals: { theme } }) => {
  const currentTheme = theme === ThemeModes.dark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  );
};
