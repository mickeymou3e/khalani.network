import { useTranslation } from "next-i18next";

import { Link, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button, ErrorIcon } from "@/components/atoms";
import { Backdrops } from "@/definitions/types";
import { useAppDispatch } from "@/store";
import { hideBackdrop, openBackdrop } from "@/store/backdrops/backdrops.store";
import { closeModal } from "@/store/ui";

import { linkStyle, mainWrapperStyles } from "./FailureBackdropView.styles";

const namespace = "common:components:backdrop";

export interface FailureBackdropViewProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string | null;
  primaryButton?: {
    label?: string | null;
    action?: () => void;
  };
  secondaryButton?: {
    label?: string | null;
    action?: () => void;
  };
}

const FailureBackdropView = ({
  icon,
  title,
  subtitle,
  primaryButton,
  secondaryButton,
}: FailureBackdropViewProps) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const titleText = title ?? t(`${namespace}:failureTitle`);
  const subtitleText = subtitle ?? t(`${namespace}:failureSubtitle`);
  const primaryButtonLabel = primaryButton?.label ?? t(`${namespace}:tryAgain`);
  const secondaryButtonLabel =
    secondaryButton?.label ?? t(`${namespace}:cancel`);
  const contactSupportLabel = t(`${namespace}:contactSupport`);

  const handleCloseBackdrop = () => {
    dispatch(hideBackdrop());
    dispatch(closeModal());
  };

  const handleContactClick = () => {
    dispatch(openBackdrop(Backdrops.CONTACT_US));
  };

  return (
    <Box sx={mainWrapperStyles}>
      {icon || <ErrorIcon />}

      <Stack alignItems="center" my={3} gap={3}>
        <Typography component="h5" variant="h5" align="center">
          {titleText}
        </Typography>

        <Typography color="primary.gray2" align="center">
          {subtitleText}
        </Typography>
      </Stack>

      <Button
        onClick={primaryButton?.action}
        variant="contained"
        size="large"
        fullWidth
      >
        {primaryButtonLabel}
      </Button>

      <Button
        onClick={secondaryButton?.action ?? handleCloseBackdrop}
        variant="text"
        size="large"
        fullWidth
      >
        {secondaryButtonLabel}
      </Button>

      <Link sx={linkStyle} variant="body2" onClick={handleContactClick}>
        {contactSupportLabel}
      </Link>
    </Box>
  );
};

export default FailureBackdropView;
