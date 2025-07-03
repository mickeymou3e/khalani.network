import { useFormik } from "formik";
import { useTranslation } from "next-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectBackdropParams } from "@/store/backdrops/backdrops.selectors";
import { hideBackdrop } from "@/store/backdrops/backdrops.store";
import { createEmail } from "@/utils/email";

import { namespace } from "../config";
import { formSchema, initialValues } from "./MainSection.helpers";

export const useMainSection = (onSubmit: () => void) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);
  const subject = useAppSelector(selectBackdropParams);
  const shouldDisableSubject = Boolean(subject);

  const handleCancel = () => {
    dispatch(hideBackdrop());
  };

  const formik = useFormik({
    initialValues: initialValues({ subject: subject ?? "" }),
    validationSchema: formSchema,
    validateOnChange: true,
    onSubmit: () => {
      window.location.href = createEmail(
        formik.values.email,
        formik.values.subject,
        formik.values.message
      );
      onSubmit();
    },
  });
  const submitButtonDisabled =
    !formik.isValid || formik.isSubmitting || !formik.dirty;

  return {
    t,
    formik,
    submitButtonDisabled,
    shouldDisableSubject,
    handleCancel,
  };
};
