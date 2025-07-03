import { Typography } from "@mui/material";

import { ExecutionSide } from "@/definitions/types";

import { RowProps } from "../types";

const ExecutionSideCell = ({ side, small }: RowProps) => {
  const color = side === ExecutionSide.BUY ? "alert.green" : "alert.red";
  const variant = small ? "body2" : "body1";

  return (
    <Typography variant={variant} color={color}>
      {side}
    </Typography>
  );
};

export default ExecutionSideCell;
