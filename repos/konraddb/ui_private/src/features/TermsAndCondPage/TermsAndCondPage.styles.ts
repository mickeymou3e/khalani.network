import Link from "next/link";

import { styled, Theme } from "@mui/material";

import { grayTextWrapperStyles } from "@/components/molecules/BackdropsMolecules/GrayTextWrapper";

export const mainWrapperStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "720px",
  mx: "auto",
};

export const textWrapperStyles = (theme: Theme) => ({
  ...grayTextWrapperStyles(theme),
  mb: 6,
  ul: {
    margin: 0,
  },
});

export const typographyStyles = {
  display: "inline-block",
};

export const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: "0.25rem",
}));

export const langButtonsWrapper = {
  display: "flex",
  justifyContent: "space-between",
  gap: 3,
  width: "100%",
  mb: 6,
};
