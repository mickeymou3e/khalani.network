import { alpha, Theme } from "@mui/material";

export const toggleButtonStyles = (theme: Theme) => ({
  "& .MuiToggleButton-root": {
    flex: 1,

    "&:first-of-type": {
      color: theme.palette.alert.green,
    },

    "&:last-of-type": {
      color: theme.palette.alert.red,
    },

    "&.Mui-selected, &:hover, &.Mui-selected:hover": {
      "&:first-of-type": {
        backgroundColor: alpha(
          theme.palette.alert.green,
          theme.custom.opacity._10percent
        ),
      },

      "&:last-of-type": {
        backgroundColor: alpha(
          theme.palette.alert.red,
          theme.custom.opacity._10percent
        ),
      },
    },
  },
});
