import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { AppRoutes } from "@/definitions/config";
import { useAcceptTermsAndCondMutation } from "@/services/account/account.api";
import { useAppSelector } from "@/store";
import { selectNeutralUserCode } from "@/store/account";

import { namespace } from "./config";

export enum Language {
  English = "en",
  German = "de",
}

export const useTermsAndCondPage = () => {
  const { t } = useTranslation(namespace);
  const router = useRouter();

  const [acceptTermsAndCond, data] = useAcceptTermsAndCondMutation();

  const userCode = useAppSelector(selectNeutralUserCode);

  const [language, setLanguage] = useState(Language.English);
  const [checkboxTrue, setCheckboxTrue] = useState(false);

  const primaryButtonAction = () => {
    const requestBody = {
      userCode,
    };

    acceptTermsAndCond(requestBody);
  };

  const secondaryButtonAction = () => {
    router.push(AppRoutes.ACCOUNT);
  };

  const changeLanguage = (language: Language) => {
    setLanguage(language);
    if (language === Language.German) {
      router.push(AppRoutes.TERMS, undefined, {
        locale: "de",
      });
    }

    if (language === Language.English) {
      router.push(AppRoutes.TERMS, undefined, {
        locale: "en",
      });
    }
  };

  useEffect(() => {
    if (data.isSuccess) {
      router.push("/");
    }
  }, [data]);

  return {
    t,
    mainViewTitle: t(`${namespace}:mainViewTitle`),
    mainViewContent1: t(`${namespace}:mainViewContent1`),

    checkboxText: t(`${namespace}:checkboxText`),
    accept: t(`${namespace}:accept`),
    cancel: t(`${namespace}:cancel`),
    neutralCopyrights: t(`${namespace}:neutralCopyrights`),

    english: t(`${namespace}:english`),
    german: t(`${namespace}:german`),
    termsOfService: t(`${namespace}:termsOfService`),
    date: t(`${namespace}:date`),

    generalProvisions: t(`${namespace}:generalProvisions`),
    generalProvisionsContent1: t(`${namespace}:generalProvisionsContent1`),
    generalProvisionsContent2: t(`${namespace}:generalProvisionsContent2`),
    generalProvisionsContent3: t(`${namespace}:generalProvisionsContent3`),

    definitions: t(`${namespace}:definitions`),
    definitionsContent1: t(`${namespace}:definitionsContent1`),
    definitionsContent2: t(`${namespace}:definitionsContent2`),
    definitionsContent3: t(`${namespace}:definitionsContent3`),
    definitionsContent4: t(`${namespace}:definitionsContent4`),
    definitionsContent5: t(`${namespace}:definitionsContent5`),
    definitionsContent6: t(`${namespace}:definitionsContent6`),
    definitionsContent7: t(`${namespace}:definitionsContent7`),
    definitionsContent8: t(`${namespace}:definitionsContent8`),
    definitionsContent9: t(`${namespace}:definitionsContent9`),
    definitionsContent10: t(`${namespace}:definitionsContent10`),
    definitionsContent11: t(`${namespace}:definitionsContent11`),
    definitionsContent12: t(`${namespace}:definitionsContent12`),
    definitionsContent13: t(`${namespace}:definitionsContent13`),
    definitionsContent14: t(`${namespace}:definitionsContent14`),
    definitionsContent15: t(`${namespace}:definitionsContent15`),

    conclusionOfContract: t(`${namespace}:conclusionOfContract`),
    conclusionOfContractContent1: t(
      `${namespace}:conclusionOfContractContent1`
    ),
    conclusionOfContractContent2: t(
      `${namespace}:conclusionOfContractContent2`
    ),
    conclusionOfContractContent3: t(
      `${namespace}:conclusionOfContractContent3`
    ),

    servicesOfDlt: t(`${namespace}:servicesOfDlt`),
    servicesOfDltContent1: t(`${namespace}:servicesOfDltContent1`),
    servicesOfDltContent2: t(`${namespace}:servicesOfDltContent2`),
    servicesOfDltContent3: t(`${namespace}:servicesOfDltContent3`),
    servicesOfDltContent4: t(`${namespace}:servicesOfDltContent4`),
    servicesOfDltContent5: t(`${namespace}:servicesOfDltContent5`),

    clientObligations: t(`${namespace}:clientObligations`),
    clientObligationsContent1: t(`${namespace}:clientObligationsContent1`, {
      returnObjects: true,
    }) as string[],
    clientObligationsContent2: t(`${namespace}:clientObligationsContent2`),
    clientObligationsContent3: t(`${namespace}:clientObligationsContent3`),

    placingOfOrders: t(`${namespace}:placingOfOrders`),
    placingOfOrdersContent1: t(`${namespace}:placingOfOrdersContent1`),
    placingOfOrdersContent2: t(`${namespace}:placingOfOrdersContent2`),

    costPaymentSettlement: t(`${namespace}:costPaymentSettlement`),
    costPaymentSettlementContent1: t(
      `${namespace}:costPaymentSettlementContent1`
    ),
    costPaymentSettlementContent2: t(
      `${namespace}:costPaymentSettlementContent2`
    ),
    costPaymentSettlementContent3: t(
      `${namespace}:costPaymentSettlementContent3`
    ),

    custodyWithDltc: t(`${namespace}:custodyWithDltc`),
    custodyWithDltcContent1: t(`${namespace}:custodyWithDltcContent1`),
    custodyWithDltcContent2: t(`${namespace}:custodyWithDltcContent2`, {
      returnObjects: true,
    }) as string[],
    custodyWithDltcContent3: t(`${namespace}:custodyWithDltcContent3`),

    liabilityProvisions: t(`${namespace}:liabilityProvisions`),
    liabilityProvisionsContent1: t(`${namespace}:liabilityProvisionsContent1`, {
      returnObjects: true,
    }) as string[],
    liabilityProvisionsContent2: t(`${namespace}:liabilityProvisionsContent2`),
    liabilityProvisionsContent3: t(`${namespace}:liabilityProvisionsContent3`),
    liabilityProvisionsContent4: t(`${namespace}:liabilityProvisionsContent4`),

    durationTermination: t(`${namespace}:durationTermination`),
    durationTerminationContent1: t(`${namespace}:durationTerminationContent1`),
    durationTerminationContent2: t(`${namespace}:durationTerminationContent2`),
    durationTerminationContent3: t(`${namespace}:durationTerminationContent3`),
    durationTerminationContent4: t(`${namespace}:durationTerminationContent4`),

    privacyStatement: t(`${namespace}:privacyStatement`),
    privacyStatementContent1: t(`${namespace}:privacyStatementContent1`),

    rightOfRevocation: t(`${namespace}:rightOfRevocation`),
    rightOfRevocationContent1: t(`${namespace}:rightOfRevocationContent1`),
    rightOfRevocationContent2: t(`${namespace}:rightOfRevocationContent2`),

    communication: t(`${namespace}:communication`),
    communicationContent1: t(`${namespace}:communicationContent1`),

    changesToTheseTradingTerms: t(`${namespace}:changesToTheseTradingTerms`),
    changesToTheseTradingTermsContent1: t(
      `${namespace}:changesToTheseTradingTermsContent1`
    ),
    changesToTheseTradingTermsContent2: t(
      `${namespace}:changesToTheseTradingTermsContent2`
    ),
    changesToTheseTradingTermsContent3: t(
      `${namespace}:changesToTheseTradingTermsContent3`,
      {
        returnObjects: true,
      }
    ) as string[],
    changesToTheseTradingTermsContent4: t(
      `${namespace}:changesToTheseTradingTermsContent4`,
      {
        returnObjects: true,
      }
    ) as string[],
    changesToTheseTradingTermsContent5: t(
      `${namespace}:changesToTheseTradingTermsContent5`
    ),

    applicableLawAndJurisdiction: t(
      `${namespace}:applicableLawAndJurisdiction`
    ),
    applicableLawAndJurisdictionContent1: t(
      `${namespace}:applicableLawAndJurisdictionContent1`
    ),
    applicableLawAndJurisdictionContent2: t(
      `${namespace}:applicableLawAndJurisdictionContent2`
    ),

    finalProvisions: t(`${namespace}:finalProvisions`),
    finalProvisionsContent1: t(`${namespace}:finalProvisionsContent1`),
    finalProvisionsContent2: t(`${namespace}:finalProvisionsContent2`),
    finalProvisionsContent3: t(`${namespace}:finalProvisionsContent3`),
    finalProvisionsContent4: t(`${namespace}:finalProvisionsContent4`),

    userCode,
    language,
    checkboxTrue,
    setCheckboxTrue,
    changeLanguage,
    primaryButtonAction,
    secondaryButtonAction,
  };
};
