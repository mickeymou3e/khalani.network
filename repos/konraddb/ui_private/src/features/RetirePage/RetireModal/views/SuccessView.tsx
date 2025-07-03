import { useTranslation } from "next-i18next";

import { CarbonPrimitives } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules";

import { namespace } from "../config";

const SuccessView = () => {
  const { t } = useTranslation(namespace);

  const successTitle = t(`${namespace}:successTitle`);
  const successSubtitle = t(`${namespace}:successSubtitle`);
  const backButtonText = t(`${namespace}:back`);

  return (
    <ResultBackdropView
      title={successTitle}
      subtitle={successSubtitle}
      primaryButtonLabel={backButtonText}
      icon={<CarbonPrimitives />}
    />
  );
};

export default SuccessView;
