import { Typography } from "@mui/material";

import { RowProps } from "../types";

const ChangeCell = ({ change, changeDirection, small }: RowProps) => {
  const color = changeDirection === 1 ? "alert.green" : "alert.red";
  const variant = small ? "body2" : "body1";

  return (
    <Typography variant={variant} color={color}>
      {change}
    </Typography>
  );
};

export default ChangeCell;
