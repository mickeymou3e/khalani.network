import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms";
import { AppRoutes } from "@/definitions/config";
import { useAppDispatch } from "@/store";
import { hideBackdrop } from "@/store/backdrops/backdrops.store";
import { closeModal } from "@/store/ui";

import { SupportDisclaimer } from "../SupportDisclaimer";
import { mainWrapperStyles } from "./ResultBackdropView.styles";

export interface ResultBackdropViewProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string | null;
  primaryButtonLabel?: string | null;
  primaryButtonAction?: () => void;
  secondaryButtonLabel?: string | null;
  secondaryButtonAction?: () => void;
  supportDisclaimer?: boolean;
}

const ResultBackdropView = ({
  icon,
  title,
  subtitle,
  primaryButtonLabel,
  primaryButtonAction,
  secondaryButtonLabel,
  secondaryButtonAction,
  supportDisclaimer,
}: ResultBackdropViewProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCloseBackdrop = () => {
    dispatch(hideBackdrop());
    dispatch(closeModal());
  };

  const handleGoHome = () => {
    router.push(AppRoutes.HOME);
  };

  return (
    <Box sx={mainWrapperStyles}>
      {icon}

      <Typography component="h5" variant="h5" align="center" mt={6}>
        {title}
      </Typography>

      <Typography
        variant="subtitle"
        color="primary.gray2"
        align="center"
        mt={3}
      >
        {subtitle}
      </Typography>

      {primaryButtonLabel && (
        <Button
          onClick={primaryButtonAction ?? handleCloseBackdrop}
          variant="contained"
          size="large"
          sx={{ marginTop: 6 }}
          fullWidth
        >
          {primaryButtonLabel}
        </Button>
      )}
      {secondaryButtonLabel && (
        <Button
          onClick={secondaryButtonAction ?? handleGoHome}
          variant="text"
          size="large"
          sx={{ marginTop: 4 }}
          fullWidth
        >
          {secondaryButtonLabel}
        </Button>
      )}

      {supportDisclaimer && <SupportDisclaimer simple />}
    </Box>
  );
};

export default ResultBackdropView;
