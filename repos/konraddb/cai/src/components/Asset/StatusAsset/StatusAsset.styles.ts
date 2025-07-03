export const styledContainer = (selected: boolean | undefined) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem",
  flex: "none",
  userSelect: "none",
  width: selected === true ? "90%" : "100%",
});

export const styledTextContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
  maxWidth: "14rem",
};

export const titleStyles = {
  overflow: "hidden",
  whiteSpace: "nowrap",
};
