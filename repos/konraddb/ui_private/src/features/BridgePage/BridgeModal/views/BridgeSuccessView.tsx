import { useTranslation } from "next-i18next";

import { Bridge } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules";
import { evaluate } from "@/utils/logic";

import { BridgeModalViews } from "../BridgeModal";
import { namespace } from "../config";

type BridgeSuccessViewProps = {
  view: BridgeModalViews;
};

const BridgeSuccessView = ({ view }: BridgeSuccessViewProps) => {
  const { t } = useTranslation(namespace);
  const isBridgeInSuccessView = view === BridgeModalViews.BridgeInSuccess;

  const successTitle = evaluate<string>(
    [!isBridgeInSuccessView, t(`${namespace}:bridgeOutSuccessTitle`)],
    [isBridgeInSuccessView, t(`${namespace}:bridgeInSuccessTitle`)]
  );
  const successSubtitle = evaluate<string>(
    [!isBridgeInSuccessView, t(`${namespace}:bridgeOutSuccessSubtitle`)],
    [isBridgeInSuccessView, t(`${namespace}:bridgeInSuccessSubtitle`)]
  );
  const backButtonText = t(`${namespace}:back`);

  return (
    <ResultBackdropView
      title={successTitle!}
      subtitle={successSubtitle}
      primaryButtonLabel={backButtonText}
      icon={<Bridge />}
    />
  );
};

export default BridgeSuccessView;
