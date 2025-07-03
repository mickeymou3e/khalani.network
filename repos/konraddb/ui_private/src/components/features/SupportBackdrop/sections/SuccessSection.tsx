import { useTranslation } from "next-i18next";

import { Box } from "@mui/material";

import { StarMountain } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules";

import { namespace } from "../config";
import { successContainerStyle } from "./SuccessSection.styles";

const SuccessSection = () => {
  const { t } = useTranslation(namespace);

  return (
    <Box sx={successContainerStyle}>
      <ResultBackdropView
        title={t(`${namespace}:successTitle`)}
        subtitle={t(`${namespace}:successDescription`)}
        primaryButtonLabel={t(`${namespace}:close`)}
        icon={<StarMountain />}
      />
    </Box>
  );
};

export default SuccessSection;
