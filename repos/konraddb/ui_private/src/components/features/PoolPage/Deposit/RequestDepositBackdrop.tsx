import { useTranslation } from "next-i18next";

import { Container, Stack } from "@mui/material";

import { Keeper } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { namespace } from "./config";

const RequestDepositConfirmationBackdrop = () => {
  const { t } = useTranslation(namespace);

  return (
    <Stack minHeight="100%" justifyContent="center" justifyItems="center">
      <Container maxWidth="mobilePortrait">
        <ResultBackdropView
          title={t(`${namespace}:successTitle`)}
          subtitle={t(`${namespace}:successSubtitle`)}
          primaryButtonLabel={t(`${namespace}:back`)}
          icon={<Keeper />}
        />
      </Container>
    </Stack>
  );
};

export default RequestDepositConfirmationBackdrop;
