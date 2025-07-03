import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { IconButton } from "@/components/atoms";

import {
  arrowButtonStyle,
  mainWrapperStyles,
  titleWrapperStyles,
} from "./BackdropTitle.styles";

export interface BackdropTitleProps {
  title: string;
  subtitle?: string;
  handleGetBack?: () => void;
}

const BackdropTitle = ({
  title,
  subtitle,
  handleGetBack,
}: BackdropTitleProps) => (
  <Box sx={mainWrapperStyles}>
    <Box sx={titleWrapperStyles}>
      {handleGetBack && (
        <IconButton onClick={handleGetBack} sx={arrowButtonStyle}>
          <ArrowBackIosNewOutlinedIcon />
        </IconButton>
      )}
      <Typography component="h5" variant="h5">
        {title}
      </Typography>
    </Box>

    {subtitle && (
      <Typography color="primary.gray2" align="center" mt={2}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default BackdropTitle;
