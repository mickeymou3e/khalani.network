import { Box } from "@mui/material";
import { styled } from "@mui/system";

export const StyledContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  flex: "none",
  userSelect: "none",
});

export const StyledTextContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
});

export const StyledIconContainer = styled(Box, {
  shouldForwardProp: (prop: string) => !["iconSize"].includes(prop),
})(({ iconSize, index = 0 }: { iconSize: number; index?: number }) => ({
  display: "flex",
  marginLeft: index === 0 ? undefined : `${-(iconSize / 3)}px`,
}));
