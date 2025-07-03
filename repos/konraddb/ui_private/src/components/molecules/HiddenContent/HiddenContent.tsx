import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PreviewIcon from "@mui/icons-material/Preview";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms";
import { iconStyles } from "@/styles/others/muiIconStyles";

import { hiddenContentStyles } from "./HiddenContent.styles";

interface HiddenContentProps {
  label: string;
  height: string;
  icon?: "EYE" | "CODE" | "WALLET";
  primaryButtonLabel?: string;
  handlePrimaryButtonAction?: () => void;
}

const HiddenContent = ({
  label,
  height,
  icon = "EYE",
  primaryButtonLabel,
  handlePrimaryButtonAction,
}: HiddenContentProps) => (
  <Box sx={hiddenContentStyles(height)}>
    {icon === "EYE" && <PreviewIcon sx={iconStyles("4rem")} />}
    {icon === "CODE" && <QrCodeScannerIcon sx={iconStyles("4rem")} />}
    {icon === "WALLET" && (
      <AccountBalanceWalletOutlinedIcon sx={iconStyles()} />
    )}

    <Typography variant="body2" color="primary.gray2">
      {label}
    </Typography>

    {icon === "WALLET" && primaryButtonLabel && (
      <Button
        variant="contained"
        size="small"
        onClick={handlePrimaryButtonAction}
      >
        {primaryButtonLabel}
      </Button>
    )}
  </Box>
);

export default HiddenContent;
