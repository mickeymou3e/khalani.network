import { alpha, Theme } from "@mui/material";

export const containerStyle = {
  alignItems: "center",
  gap: 2,
};

export const innerContainerStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 2,
  marginTop: 4,
};

export const sectionStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1,
  padding: "1.5rem",
  width: "100%",
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._3percent
  ),
  borderRadius: "1rem",
});

export const rowStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
};

export const rowEndStyle = {
  display: "flex",
  flexDirection: "row",
  gap: 1,
};

export const valueStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};

export const labelsStyle = {
  display: "flex",
  flexDirection: "column",
};

export const labelStyle = {
  marginTop: 0.5,
};

export const iconButtonStyle = {
  marginTop: -0.5,
};

export const buttonStyle = {
  marginTop: 4,
};
