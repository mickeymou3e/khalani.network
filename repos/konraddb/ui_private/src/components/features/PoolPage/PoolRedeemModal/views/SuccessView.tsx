import { useTranslation } from "next-i18next";

import { Keeper } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules";

const SuccessView = ({ namespace }: { namespace: string }) => {
  const { t } = useTranslation(namespace);

  return (
    <ResultBackdropView
      title={t(`${namespace}:successTitle`)}
      subtitle={t(`${namespace}:successSubtitle`)}
      primaryButtonLabel={t(`${namespace}:back`)}
      icon={<Keeper />}
    />
  );
};

export default SuccessView;
