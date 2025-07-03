import Stack from "@mui/material/Stack";
import styled from "@mui/system/styled";

export const StyledStack = styled(Stack)(
  ({
    snackbarbackground,
    progressbarbackground,
    completed,
  }: {
    snackbarbackground: string | undefined;
    progressbarbackground: string | undefined;
    completed: number;
  }) => ({
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    position: "relative",
    backdropFilter: "blur(8px)",
    minWidth: 440,
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: snackbarbackground,

    ":before": {
      position: "absolute",
      display: "block",
      content: "''",
      background: progressbarbackground,
      height: "1px",
      right: 0,
      width: `calc(${completed}% - 1.5rem)`,
      bottom: 0,
      transition: "width 8400ms linear",
    },
  })
);
