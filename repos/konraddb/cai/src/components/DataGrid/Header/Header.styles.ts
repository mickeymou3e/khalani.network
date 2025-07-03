import { Theme } from "@mui/material";

export const headRowStyle =
  (noExtraPadding: boolean, inline = false) =>
  (theme: Theme) => ({
    "& th": {
      padding: theme.spacing(1),
      border: "0px",
      color: theme.palette.primary.main,
      backgroundColor: inline
        ? "transparent"
        : theme.palette.primary.gridHeader,

      "&:first-of-type": {
        paddingLeft: theme.spacing(noExtraPadding || inline ? 0 : 3),
      },
      "&:last-of-type": {
        paddingRight: theme.spacing(noExtraPadding || inline ? 1 : 3),
      },

      "& *": {
        whiteSpace: "nowrap",
      },
    },
  });

export const sortLabelStyle = (align?: string) => (theme: Theme) => {
  const isRight = align === "right";

  return {
    "& .MuiButtonBase-root": {
      margin: theme.spacing(0, isRight ? 2 : 0, 0, isRight ? 0 : 0.5),
    },
  };
};

export const sortIconStyle = (disabled: boolean) => () => ({
  "& svg": {
    color: disabled ? "primary.gray2" : "primary.main",
  },
});
