import { useTranslation } from "next-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms";
import { Backdrops } from "@/definitions/types";
import { useAppDispatch } from "@/store";
import { openBackdrop } from "@/store/backdrops/backdrops.store";

import { buttonExtraStyles } from "./SupportDisclaimer.styles";

interface SupportDisclaimerProps {
  simple?: boolean;
}

const SupportDisclaimer = ({ simple = false }: SupportDisclaimerProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");

  const handleContactSupport = () => {
    dispatch(openBackdrop(Backdrops.CONTACT_US));
  };

  return (
    <Box display="flex" justifyContent="center">
      {!simple && (
        <Typography color="primary.gray2" mr={3}>
          {t(`common:needHelp`)}
        </Typography>
      )}
      <Button onClick={handleContactSupport} sx={buttonExtraStyles}>
        {t(`common:contactSupport`)}
      </Button>
    </Box>
  );
};

export default SupportDisclaimer;
