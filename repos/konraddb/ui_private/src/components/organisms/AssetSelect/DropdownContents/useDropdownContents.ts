import { useState } from "react";
import { useTranslation } from "next-i18next";

import { RowProps } from "@/components/molecules";

import { createColumnConfig, namespace } from "./config";
import { DropdownContentsProps } from "./DropdownContents";

export const useDropdownContents = ({
  dataProvider,
  onSelect,
  onClose,
}: DropdownContentsProps) => {
  const { t } = useTranslation(namespace);
  const [keyword, setKeyword] = useState("");
  const columnConfig = createColumnConfig(t);

  const handleRowClick = (row: RowProps) => {
    onSelect(row);
    onClose();
  };

  return {
    keyword,
    setKeyword,
    dataProvider,
    gridColumns: columnConfig,
    handleRowClick,
  };
};
