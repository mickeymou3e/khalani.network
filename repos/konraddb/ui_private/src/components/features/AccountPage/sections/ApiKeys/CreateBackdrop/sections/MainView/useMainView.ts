import { useMemo } from "react";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import { CreateApiErrors, createApiToken } from "@/services/account";
import { useAppDispatch } from "@/store";
import { hideBackdrop } from "@/store/backdrops";
import { createGetInputProps } from "@/utils/formik";

import { namespace } from "../../config";
import { CreateBackdropViews } from "../../useCreateBackdrop";
import { initializeKeyValues } from "./MainView.helpers";

type FormProps = {
  name: string;
  publicKeyValue: string;
  privateKeyValue: string;
};

const initialValues = {
  name: "",
  publicKeyValue: "",
  privateKeyValue: "",
};

export const validationSchema = yup.object({
  name: yup.string().min(3, ":apiKeyMinRequirements").required(":required"),
});

export const useMainView = (setView: (view: CreateBackdropViews) => void) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const createApiKeyLabel = t(`${namespace}:createApiKey`);
  const createApiKeyDisclaimer = t(`${namespace}:createApiKeyDisclaimer`);
  const labelPlaceholder = t(`${namespace}:labelPlaceholder`);
  const labelText = t(`${namespace}:label`);
  const publicKeyLabel = t(`${namespace}:publicKey`);
  const privateKeyLabel = t(`${namespace}:privateKey`);
  const disclaimerLabel = t(`${namespace}:disclaimer`);
  const nextLabel = t(`${namespace}:next`);
  const cancelLabel = t(`${namespace}:cancel`);
  const keyValues = useMemo(() => initializeKeyValues(), []);

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      publicKeyValue: keyValues.publicKey,
      privateKeyValue: keyValues.privateKey,
    },
    validationSchema,
    onSubmit: async (values: FormProps) => {
      const signature = keyValues.createSignature(values.name);
      const { error } = (await dispatch(
        createApiToken({
          label: values.name,
          public_key: values.publicKeyValue,
          signature,
        })
      )) as any;

      error
        ? formik.setErrors({
            name:
              error.data.value === CreateApiErrors.Duplicate
                ? ":apiKeysDuplicate"
                : ":apiKeysUnknownError",
          })
        : setView(CreateBackdropViews.Success);
    },
  });
  const getInputProps = createGetInputProps(t, formik, namespace);

  const handleCloseBackdrop = () => {
    dispatch(hideBackdrop());
  };

  return {
    formik,
    createApiKeyLabel,
    createApiKeyDisclaimer,
    labelPlaceholder,
    labelText,
    publicKeyLabel,
    privateKeyLabel,
    disclaimerLabel,
    nextLabel,
    cancelLabel,
    getInputProps,
    handleCloseBackdrop,
  };
};
