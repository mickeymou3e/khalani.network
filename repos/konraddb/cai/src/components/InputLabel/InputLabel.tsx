import { Box, Typography } from "@mui/material";

import { StyledContainer, StyledLabelContainer } from "./InputLabel.styles";
import { InputLabelProps } from "./types";
import { InfoPopover } from "../InfoPopover";

export const InputLabel = ({
  LabelProps,
  SecondaryLabelProps,
  TertiaryLabelProps,
  QuaternaryLabelProps,
  error = false,
  sx,
  tooltipTitle,
  ...boxProps
}: InputLabelProps) => (
  <StyledContainer {...boxProps} sx={sx}>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      width={tooltipTitle ? "100%" : "auto"}
    >
      {LabelProps && (
        <Typography
          variant="inputLabel"
          color={error ? "alert.red" : "primary.gray2"}
          {...LabelProps.TypographyProps}
        >
          {LabelProps.value}
        </Typography>
      )}

      {tooltipTitle && (
        <InfoPopover>
          <Typography variant="body2" color="primary.gray2">
            {tooltipTitle}
          </Typography>
        </InfoPopover>
      )}
    </Box>
    <StyledLabelContainer>
      {SecondaryLabelProps && (
        <Typography
          variant="inputLabel"
          color="primary.gray2"
          {...SecondaryLabelProps.TypographyProps}
        >
          {SecondaryLabelProps.value}
        </Typography>
      )}
      {TertiaryLabelProps && (
        <Typography
          variant="inputLabel"
          color="primary.main"
          {...TertiaryLabelProps.TypographyProps}
        >
          {TertiaryLabelProps.value}
        </Typography>
      )}
      {QuaternaryLabelProps && (
        <Typography
          variant="inputLabel"
          color="primary.main"
          {...QuaternaryLabelProps.TypographyProps}
        >
          {QuaternaryLabelProps.value}
        </Typography>
      )}
    </StyledLabelContainer>
  </StyledContainer>
);
