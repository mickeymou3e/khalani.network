import { SxProps, Theme } from "@mui/material";

export const modalStyle = (theme: Theme) => ({
  "& .MuiPaper-root": {
    background: theme.palette.background.default,
  },
});

export const contentContainerStyle: SxProps<Theme> = {
  display: "block",
  margin: "auto",
  height: "100%",

  "&:after": {
    content: '""',
    display: "inline-block",
    verticalAlign: "middle",
    height: "100%",
  },
};

export const innerContentContainerStyle = (width: string): SxProps<Theme> => ({
  display: "inline-block",
  verticalAlign: "middle",
  margin: "5rem 0",
  width,
});

export const buttonStyle = (theme: Theme) => ({
  position: "fixed",
  top: 0,
  right: 0,
  margin: "4.5rem",
  padding: "1rem",

  [theme.breakpoints.down("mobileLandscape")]: {
    position: "absolute",
    margin: "1rem",
  },
});
