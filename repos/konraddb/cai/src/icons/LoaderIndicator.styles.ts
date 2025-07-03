import { alpha, SxProps, Theme } from "@mui/material";

export const loaderIndicatorStyles: SxProps<Theme> = (theme: Theme) => ({
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  position: "relative",
  background: alpha(theme.palette.primary.main, 0.5),

  "&:before,:after": {
    content: '" "',
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: theme.palette.primary.main,
    animation: "slide 1s infinite linear alternate",
    opacity: 0.3,
  },
  "&:after": {
    animation: "slide2 1s infinite linear alternate",
    opacity: 1,
  },

  "@keyframes slide": {
    "0% , 20%": { transform: "translate(0, 0)" },
    "80% , 100%": { transform: "translate(15px, 15px)" },
  },
  "@keyframes slide2": {
    "0% , 20%": { transform: "translate(0, 0)" },
    "80% , 100%": { transform: "translate(-15px, -15px)" },
  },
});
