import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1d4ed8",
    },
    secondary: {
      main: "#151515",
    },
    error: {
      main: "#8d14ff",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a1a1aa",
    },
    background: {
      default: "#000000",
    },
  },
  typography: {
    allVariants: {
      color: "#ffffff",
    },
    fontFamily: ["Montserrat", "sans-serif"].join(","),
    h1: {
      fontSize: 32,
      fontWeight: 700,
    },
    h2: {
      fontSize: 28,
      fontWeight: 600,
    },
    h3: {
      fontSize: 24,
      fontWeight: 600,
    },
    h4: {
      fontSize: 18,
      fontWeight: 500,
    },
    h5: {
      fontSize: 16,
      fontWeight: 500,
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
    },
    body2: {
      fontSize: 15,
      fontWeight: 400,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          backgroundColor: "#121212",
        },
        elevation2: {
          backgroundColor: "#202020",
        },
      },
    },
  },
});

export default theme;
