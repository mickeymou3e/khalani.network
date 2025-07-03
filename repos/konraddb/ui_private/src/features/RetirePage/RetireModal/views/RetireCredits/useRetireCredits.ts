import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import {
  resetSelection,
  retire,
  selectSelectionList,
} from "@/features/RetirePage/store";
import { RetireConfirmParams } from "@/features/RetirePage/store/retire.types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectPoolTokenDepositAddress,
  selectStrategy,
  selectTxFeeDepositAddress,
} from "@/store/ancillary";
import { closeModal } from "@/store/ui";
import { createGetInputProps } from "@/utils/formik";

import { namespace } from "../../config";
import { RetireModalViews } from "../../useRetireModal";
import { RetireCreditsProps } from "./RetireCredits";

export const formSchema = yup.object({
  beneficiary: yup.string(),
  auditYear: yup.number().typeError(":auditYear").required(":required"),
  reason: yup.string().required(":required"),
  eAudit: yup.boolean(),
});

const initialValues: RetireConfirmParams = {
  beneficiary: "",
  auditYear: "",
  reason: "",
  eAudit: false,
};

export const useRetireCredits = ({ setView }: RetireCreditsProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);
  const selectionList = useAppSelector(selectSelectionList);
  const selectedStrategy = useAppSelector(selectStrategy);
  const txFeeDepositAddress = useAppSelector(selectTxFeeDepositAddress);
  const poolTokenDepositAddress = useAppSelector(selectPoolTokenDepositAddress);
  const title = t(`${namespace}:retireCredits`);
  const subtitle = t(`${namespace}:retireCreditsDescription`);
  const beneficiaryPlaceholder = t(`${namespace}:beneficiaryPlaceholder`);
  const auditYearPlaceholder = t(`${namespace}:auditYearPlaceholder`);
  const reasonPlaceholder = t(`${namespace}:reasonPlaceholder`);
  const greenEAudit = t(`${namespace}:greenEAudit`);
  const retireLabel = t(`${namespace}:retire`);
  const cancelLabel = t(`${namespace}:cancel`);
  const popoverContent = t(`${namespace}:infoPopoverContent`);

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: async (formValues: RetireConfirmParams) => {
      setView(RetireModalViews.Loading);

      const result = await retire({
        strategy: selectedStrategy,
        selectionList,
        formValues,
        poolTokenDepositAddress,
        txFeeDepositAddress,
      });

      if (!result) {
        setView(RetireModalViews.Failed);
        return;
      }

      setView(RetireModalViews.Success);
      dispatch(resetSelection());
    },
  });
  const getInputProps = createGetInputProps(t, formik, namespace);
  const submitButtonDisabled =
    !formik.isValid || formik.isSubmitting || !formik.dirty;

  return {
    formik,
    submitButtonDisabled,
    title,
    subtitle,
    beneficiaryPlaceholder,
    auditYearPlaceholder,
    reasonPlaceholder,
    greenEAudit,
    retireLabel,
    cancelLabel,
    popoverContent,
    getInputProps,
    handleCancel,
  };
};
