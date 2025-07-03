import { alpha, Theme } from "@mui/material";

export const containerStyle = {
  display: "inline-block",
  verticalAlign: "middle",
  width: "100%",
  margin: "5rem 0",

  "& form": {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
};

export const qrCodeContainer = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 2,
  mt: 4,
  mb: 2,
};

export const qrCodeWrapper = (theme: Theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 5,
  width: "100%",
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._3percent
  ),
  borderRadius: 2,
});

export const innerQrCodeWrapper = (theme: Theme) => ({
  padding: 1,
  paddingBottom: 0,
  backgroundColor: theme.palette.common.white,
  borderRadius: 2,
});

export const inputStyle = {
  width: "100%",

  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

export const qrCodeHintStyle = {
  display: "flex",
  alignItems: "center",
  gap: 2,
};

export const iconStyles = {
  color: "primary.gray2",
};

export const signupButtonStyle = {
  marginTop: 4,
};
