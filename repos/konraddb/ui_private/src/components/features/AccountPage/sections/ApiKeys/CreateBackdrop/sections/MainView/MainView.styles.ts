import { Theme } from "@mui/material";

import { grayTextWrapperStyles } from "@/components/molecules/BackdropsMolecules/GrayTextWrapper";

export const mainWrapperStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  mx: "auto",
  gap: 6,
};

export const formWrapper = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 3,
};

export const radioButton = (theme: Theme) => ({
  ...grayTextWrapperStyles(theme),

  "& .MuiFormGroup-root": {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  "& .MuiFormControlLabel-root": {
    margin: 0,
  },

  "& .MuiFormControlLabel-label": {
    textTransform: "capitalize",
    color: theme.palette.primary.gray2,
  },

  "& .MuiRadio-root": {
    padding: "0 0.5rem 0 0",
  },
});

export const privateKeyWrapper = (theme: Theme) => ({
  ...grayTextWrapperStyles(theme),
  display: "flex",
  justifyContent: "space-between",
  gap: 3,
});
