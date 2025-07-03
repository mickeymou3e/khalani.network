import { DisplayOrder } from "@/definitions/types";

const containerStyle = {
  padding: 0,
  margin: 0,
  top: "5rem",
  minWidth: 440,
};

export const mainSnackbarContainerStyle = {
  ...containerStyle,
  right: 0,
  zIndex: DisplayOrder.MAIN,
};

export const fixedSnackbarContainerStyle = (unset: boolean) =>
  ({
    ...containerStyle,
    width: unset ? "unset" : containerStyle.minWidth,
    position: "absolute",
    right: "3rem",
    zIndex: DisplayOrder.PAGE,
  } as const);

export const snackbarStyle = {
  margin: 0,
  padding: 0,
  boxShadow: "none",
  borderRadius: 0,
  marginBottom: "0.5rem",
};

export const snackbarBodyStyle = {
  padding: 0,
  margin: 0,
};
