import { useTranslation } from "next-i18next";

import { Symbols } from "@/definitions/types";
import {
  selectSelectedBridgeInAsset,
  selectSelectedRegistry,
} from "@/features/BridgePage/store";
import { useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account";
import { selectIsValidLogin } from "@/store/auth";
import { evaluate } from "@/utils/logic";

import { namespace } from "../config";

export const useSummary = () => {
  const { t } = useTranslation(namespace);
  const selectedAsset = useAppSelector(selectSelectedBridgeInAsset);
  const selectedRegistry = useAppSelector(selectSelectedRegistry);
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const isAdmin = useAppSelector(selectIsAdminUser);

  const summary = t(`${namespace}:summary`);
  const transferRegistryAccountId = t(`${namespace}:transferRegistryAccountId`);
  const copy = t(`${namespace}:copy`);
  const copied = t(`${namespace}:copied`);
  const bridgingHint = t(`${namespace}:bridgingHint`);
  const unavailabilityReasonText = evaluate(
    [true, ""],
    [
      isLoggedIn && !isAdmin && Boolean(selectedAsset),
      t(`${namespace}:notEnoughPermission`),
    ],
    [!isLoggedIn, t(`${namespace}:login`)],
    [!selectedRegistry && !selectedAsset, t(`${namespace}:selectAsset`)]
  ) as string;
  const summaryContents = [
    {
      label: t(`${namespace}:accountHolder`),
      value: selectedAsset?.accountHolder ?? "",
    },
    {
      label: t(`${namespace}:creditType`),
      value: selectedAsset?.name ?? "",
    },
    {
      label: t(`${namespace}:registry`),
      value: selectedRegistry?.name ?? Symbols.NoValue,
    },
  ];

  return {
    selectedRegistry,
    unavailabilityReasonText,
    summary,
    transferRegistryAccountId,
    copy,
    summaryContents,
    bridgingHint,
    copied,
  };
};
