import Image from "next/image";

import { Box, Typography } from "@mui/material";

import { InfoPopover } from "../../InfoPopover";
import { RowProps } from "../types";

const ValueCell = ({
  value,
  secondaryValue,
  icon,
  small,
  isTooltip,
  tooltipContent,
  bold = false,
}: RowProps) => (
  <Box display="flex" flexDirection="row" alignItems="center" gap={1.5}>
    {icon && <Image src={icon} alt={value} width={24} height={24} />}
    <Box display="flex" flexDirection="column">
      <Typography
        variant={small ? "body2" : "body1"}
        fontWeight={bold ? "bold" : "normal"}
      >
        {value}
      </Typography>
      <Typography variant="caption" color="primary.gray2">
        {secondaryValue}
      </Typography>
    </Box>
    {isTooltip && (
      <InfoPopover
        width="auto"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {tooltipContent}
      </InfoPopover>
    )}
  </Box>
);

export default ValueCell;
