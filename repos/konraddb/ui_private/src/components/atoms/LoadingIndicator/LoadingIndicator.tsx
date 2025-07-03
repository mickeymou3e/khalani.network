import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { containerStyle } from "./LoadingIndicator.styles";

const LoadingIndicator = () => (
    <Box sx={containerStyle}>
      <CircularProgress />
    </Box>
  );

export default LoadingIndicator;
