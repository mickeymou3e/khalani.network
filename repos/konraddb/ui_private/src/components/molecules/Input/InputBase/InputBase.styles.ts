import { Theme } from "@mui/material";

export const inputStyle = (alert: boolean) => (theme: Theme) =>
  ({
    "& .MuiOutlinedInput-root": {
      color: alert ? theme.palette.alert.blue : undefined,
      "& .MuiOutlinedInput-notchedOutline": {
        borderWidth: 1,
        borderColor: alert
          ? `${theme.palette.alert.blue} !important`
          : undefined,
      },
      "&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
        backgroundColor: alert ? "transparent !important" : undefined,
      },
      "& .MuiInputAdornment-root.MuiInputAdornment-positionEnd > .MuiTypography-root":
        {
          color: `${theme.palette.primary.gray2}`,
        },
    },
  } as const);
