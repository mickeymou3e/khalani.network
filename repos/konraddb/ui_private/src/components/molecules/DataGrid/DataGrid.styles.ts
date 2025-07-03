import { Theme } from "@mui/material";

export const outerTableContainerStyle =
  (
    maxHeight: number | string,
    hasScrollbar: boolean,
    enableHorizontalScroll: boolean,
    inline = false
  ) =>
  (theme: Theme) => {
    const normalPadding = enableHorizontalScroll
      ? "1.5rem 1.75rem"
      : `0.5rem ${hasScrollbar ? "1rem" : "0"} 1rem 0`;
    const normalRadius = enableHorizontalScroll ? "2rem" : "1rem";

    return {
      display: "flex",
      flexDirection: "column",
      background: inline
        ? "transparent"
        : theme.palette.primary.backgroundGradient,
      maxHeight,
      borderRadius: inline ? 0 : normalRadius,
      padding: inline ? 0 : normalPadding,
      overflow: "hidden",
    };
  };

export const innerContainerStyle = (enableHorizontalScroll: boolean) => ({
  flex: 1,
  overflowY: "auto",
  overflowX: enableHorizontalScroll ? "auto" : "hidden",
  height: "100%",
});

export const tableStyle = (empty: boolean) => () =>
  ({
    borderCollapse: "collapse",
    height: empty ? "100%" : undefined,
  } as const);

export const paginationContainerStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

export const paginationStyle = (theme: Theme) => ({
  margin: theme.spacing(2, 0),
});

export const pageSizeContainer = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 2,

  "& .MuiTextField-root": {
    width: "7rem",
  },
};
