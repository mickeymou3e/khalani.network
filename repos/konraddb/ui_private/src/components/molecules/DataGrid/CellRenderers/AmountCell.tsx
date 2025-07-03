import { Box, Typography } from "@mui/material";

import { RowProps } from "../types";

const AmountCell = ({ value, small, strong }: RowProps) => (
  <Box display="flex" flexDirection="column">
    <Typography
      variant={small ? "body2" : "body1"}
      fontWeight={strong ? "bold" : "normal"}
    >
      {value}
    </Typography>
  </Box>
);

export default AmountCell;
