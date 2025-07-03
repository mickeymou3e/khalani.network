import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms";

import { mainWrapperStyles } from "./SubpageHeader.styles";

interface SubpageHeaderProps {
  label?: string | null;
  title?: string | null;
  subtitle?: string;
  buttonLabel?: string;
  disabled?: boolean;
  handleButtonClick?: () => void;
}

const SubpageHeader = ({
  label,
  title,
  subtitle,
  buttonLabel,
  disabled = false,
  handleButtonClick,
}: SubpageHeaderProps) => (
  <Box sx={mainWrapperStyles}>
    <Box>
      {label && (
        <Typography variant="buttonMedium" color="primary.gray2" mb={1}>
          {label}
        </Typography>
      )}

      {title && (
        <Typography component="h4" variant="h4" mb={1}>
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography variant="subtitle" fontWeight={400} color="primary.gray2">
          {subtitle}
        </Typography>
      )}
    </Box>

    {buttonLabel && (
      <Button
        variant="contained"
        onClick={handleButtonClick}
        disabled={disabled}
      >
        {buttonLabel}
      </Button>
    )}
  </Box>
);

export default SubpageHeader;
