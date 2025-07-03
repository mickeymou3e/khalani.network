import { Typography } from "@mui/material";

import { formatValue } from "@/utils/formatters";

import { RowProps } from "../types";

const ChangeCell = ({
  change,
  changeDirection,
  small,
  isString = false,
}: RowProps) => {
  const color = changeDirection === 1 ? "alert.green" : "alert.red";
  const variant = small ? "body2" : "body1";

  return (
    <Typography variant={variant} color={isString ? "primary" : color}>
      {isString ? change : formatValue(change)}
    </Typography>
  );
};

export default ChangeCell;
