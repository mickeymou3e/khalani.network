import { createTheme } from "@mui/material/styles";

export const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      main: "#121212",
    },
    text: {
      secondary: "#484D4E",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        sizeLarge: {
          padding: 12,
        },
      },
    },
  },
});
