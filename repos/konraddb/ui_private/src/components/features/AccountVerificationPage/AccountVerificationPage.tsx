import { useEffect } from "react";
import { useTranslation } from "next-i18next";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { Button, KindOfWorm } from "@/components/atoms";

import { mainWrapperStyles } from "./AccountVerificationPage.styles";
import { namespace } from "./config";
import { useAccountVerificationPage } from "./useAccountVerificationPage";

const AccountVerificationPage = () => {
  const { t } = useTranslation(namespace);

  const { verifyAccount, handleLogin, handleGoHome, isLoggedIn } =
    useAccountVerificationPage();

  useEffect(() => {
    verifyAccount();
  }, []);

  return (
    <Box sx={mainWrapperStyles}>
      <KindOfWorm />

      <Typography component="h5" variant="h5" mt={6}>
        {t(`${namespace}:title`)}
      </Typography>

      <Typography
        variant="subtitle"
        color="primary.gray2"
        mt={2}
        mb={6}
        align="center"
      >
        {t(`${namespace}:message`)}
      </Typography>

      {!isLoggedIn && (
        <Button
          onClick={handleLogin}
          variant="contained"
          size="large"
          sx={{ marginBottom: 3 }}
          fullWidth
        >
          {t(`${namespace}:login`)}
        </Button>
      )}

      <Button onClick={handleGoHome} variant="text" size="large" fullWidth>
        {t(`${namespace}:goToHome`)}
      </Button>
    </Box>
  );
};

export default AccountVerificationPage;
