import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { RowProps } from "@/components/molecules";
import { AppRoutes } from "@/definitions/config";
import { useAncillarySubscriptions } from "@/hooks/ancillary";
import { useAppSelector } from "@/store";

import { createColumnConfig, namespace } from "./config";
import { selectGridData } from "./MarketsPage.selectors";

export const useMarketsPage = () => {
  const router = useRouter();
  const { t } = useTranslation(namespace);
  useAncillarySubscriptions();
  const columnConfig = createColumnConfig(t);
  const dataProvider = useAppSelector(selectGridData);
  const pageTitle = t(`${namespace}:markets`);

  const handleCellClick = (row: RowProps) => {
    router.push(`${AppRoutes.TRADE}/${row.id.replace("/", "_")}`);
  };

  return {
    pageTitle,
    dataProvider,
    columnConfig,
    handleCellClick,
  };
};
