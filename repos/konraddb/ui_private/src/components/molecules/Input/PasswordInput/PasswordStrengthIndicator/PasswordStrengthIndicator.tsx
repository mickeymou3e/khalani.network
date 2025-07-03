import { Box, Typography } from "@mui/material";

import {
  containerStyle,
  indicatorContainerStyle,
  indicatorStyle,
  textStyle,
} from "./PasswordStrengthIndicator.styles";
import { usePasswordStrength } from "./usePasswordStrength";

type PasswordStrengthIndicatorProps = {
  password: string;
};

const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  const { passwordStrength, passwordStrengthText } =
    usePasswordStrength(password);

  return (
    <Box sx={containerStyle}>
      <Typography sx={textStyle(passwordStrength)} variant="inputLabel">
        {passwordStrengthText}
      </Typography>
      <Box sx={indicatorContainerStyle}>
        <Box sx={indicatorStyle(passwordStrength)} />
      </Box>
    </Box>
  );
};

export default PasswordStrengthIndicator;
