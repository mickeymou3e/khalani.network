import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { grayTextWrapperStyles } from "./GrayTextWrapper.styles";

export interface GrayTextWrapperProps {
  content: string[];
}

const GrayTextWrapper = ({ content }: GrayTextWrapperProps) => (
  <Box sx={grayTextWrapperStyles} width="100%">
    {content.map((text, index) => (
      <Typography variant="body2" mt={index === 0 ? 0 : 1} key={index}>
        {text}
      </Typography>
    ))}
  </Box>
);

export default GrayTextWrapper;
