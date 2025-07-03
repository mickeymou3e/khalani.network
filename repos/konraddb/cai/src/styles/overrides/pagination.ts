import { alpha, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const paginationOverrides = (
  theme: Theme
): Partial<OverridesStyleRules> => ({
  styleOverrides: {
    root: {
      "& .MuiPaginationItem-root.Mui-selected": {
        background: alpha(
          theme.palette.primary.main,
          theme.custom.opacity._5percent
        ),
        "&:hover": {
          background: alpha(
            theme.palette.primary.main,
            theme.custom.opacity._5percent
          ),
        },
      },
    },
  },
});
