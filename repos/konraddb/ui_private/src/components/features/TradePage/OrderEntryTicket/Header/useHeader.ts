import { useTranslation } from "next-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectSelectedTicketValues } from "@/store/ui/ui.selectors";
import { changeExecutionSide } from "@/store/ui/ui.store";

import { createSideToggleGroupValues } from "../config";

const useHeader = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sides = createSideToggleGroupValues(t);
  const ticketValues = useAppSelector(selectSelectedTicketValues);

  const handleToggleChange = (_: unknown, value: string) => {
    if (!value) return;

    dispatch(changeExecutionSide(value));
  };

  return {
    sides,
    selectedSide: ticketValues.side,
    handleToggleChange,
  };
};

export default useHeader;
