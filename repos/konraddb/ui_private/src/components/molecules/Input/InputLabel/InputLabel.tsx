import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Tooltip, Typography } from "@mui/material";

import { IconButton } from "@/components/atoms";

import { StyledContainer, StyledLabelContainer } from "./InputLabel.styles";
import { InputLabelProps } from "./types";

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
    <Box display="flex" alignItems="center" gap={2}>
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
        <Tooltip title={tooltipTitle}>
          <IconButton size="small">
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
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
