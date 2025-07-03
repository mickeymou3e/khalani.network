import CopyToClipboard from "react-copy-to-clipboard";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Typography } from "@mui/material";

import { IconButton } from "@/components/atoms";
import { ExecutionSide } from "@/definitions/types";
import { evaluate } from "@/utils/logic";

import {
  iconButtonStyle,
  labelsStyle,
  labelStyle,
  rowEndStyle,
  rowStyle,
  valueStyle,
} from "./OrderDetailsModal.styles";

type OrderDetailsRowProps = {
  label: string;
  secondaryLabel?: string;
  value?: string;
  secondaryValue?: string;
  side?: ExecutionSide;
  showButton?: boolean;
};

const sideColors = (side?: ExecutionSide) =>
  evaluate(
    [!side, "primary.main"],
    [side === ExecutionSide.BUY, "alert.green"],
    [side === ExecutionSide.SELL, "alert.red"]
  ) as string;

export const OrderDetailsRow = ({
  label,
  secondaryLabel,
  value,
  secondaryValue,
  side,
  showButton,
}: OrderDetailsRowProps) => (
  <Box sx={rowStyle}>
    <Box sx={labelsStyle}>
      <Typography variant="body2">{label}</Typography>
      {secondaryLabel && (
        <Typography sx={labelStyle} variant="body3" color="primary.gray2">
          {secondaryLabel}
        </Typography>
      )}
    </Box>
    <Box sx={rowEndStyle}>
      <Box sx={valueStyle}>
        <Typography variant="body2" fontWeight="bold" color={sideColors(side)}>
          {value}
        </Typography>
        {secondaryValue && (
          <Typography sx={labelStyle} variant="body3" color="primary.gray2">
            {secondaryValue}
          </Typography>
        )}
      </Box>
      {showButton && (
        <CopyToClipboard text={value ?? ""}>
          <IconButton sx={iconButtonStyle} size="small" variant="outlined">
            <ContentCopyIcon />
          </IconButton>
        </CopyToClipboard>
      )}
    </Box>
  </Box>
);
