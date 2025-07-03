import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Typography } from "@mui/material";

import { Button, IconButton } from "@/components/atoms";
import { WalletPageTabs } from "@/definitions/types";

import { containerStyle, contentStyle, sectionsStyle } from "./Summary.styles";
import { useSummary } from "./useSummary";

interface SummaryProps {
  setSelectedTab: (value: WalletPageTabs) => void;
}

const Summary = ({ setSelectedTab }: SummaryProps) => {
  const {
    portfolioText,
    depositText,
    withdrawText,
    portfolioTotalValueNumber,
    portfolioTotalValue,
    portfolioTotalValueEur,
    hideValues,
    withdrawalDisabled,
    isAdmin,
    handleHidePortfolioValues,
  } = useSummary();

  const IconComponent = hideValues
    ? VisibilityOffOutlinedIcon
    : VisibilityOutlinedIcon;

  return (
    <Box sx={containerStyle}>
      <Box sx={sectionsStyle}>
        <Box sx={contentStyle}>
          <Typography variant="buttonMedium" color="primary.gray2">
            {portfolioText}
          </Typography>
          <IconButton
            size="small"
            variant="outlined"
            onClick={handleHidePortfolioValues}
          >
            <IconComponent />
          </IconButton>
        </Box>
        <Typography variant="h5" color="primary.main">
          {portfolioTotalValue}
        </Typography>
        <Typography variant="body1" color="primary.gray2">
          {portfolioTotalValueEur}
        </Typography>
      </Box>

      {isAdmin && (
        <Box sx={contentStyle}>
          <Button
            variant={
              Number(portfolioTotalValueNumber) < 1 ? "contained" : "outlined"
            }
            size="medium"
            onClick={() => setSelectedTab(WalletPageTabs.deposits)}
          >
            {depositText}
          </Button>
          <Button
            variant="outlined"
            size="medium"
            disabled={withdrawalDisabled}
            onClick={() => setSelectedTab(WalletPageTabs.withdrawals)}
          >
            {withdrawText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Summary;
