import { FormikProps } from "formik";
import * as yup from "yup";

export const formikError = (name: string, formik: any) => ({
  error: formik.touched[name] && !!formik.errors[name],
});

export const formikErrorText = (name: string, formik: any) =>
  formik.touched[name] && formik.errors[name];

export const setTouchedFields = (
  formik: FormikProps<any>,
  ...names: string[]
) => {
  setTimeout(() => {
    names.forEach((name) => formik.setTouched({ [name]: true }, true));
  }, 0);
};

export const validateFields = (
  formik: FormikProps<any>,
  ...names: string[]
) => {
  setTimeout(() => {
    names.forEach((name) => formik.validateField(name));
  }, 0);
};

export const authCodeSchema = yup.object({
  code: yup
    .string()
    .required(":required")
    .min(6, ":codeExacly6Marks")
    .max(6, ":codeExacly6Marks"),
});

export const createGetInputProps =
  (t: TFunc, formik: FormikProps<any>, namespace: string) => (key: string) => {
    const isError = Boolean(formik.touched[key] && formik.errors[key]);
    const errorMessage = isError
      ? t(`common:formsValidations${formik.errors[key]}`)
      : "";

    return {
      TopLabelProps: {
        LabelProps: {
          value: t(`${namespace}:${key}`),
        },
      },
      BottomLabelProps: {
        LabelProps: {
          value: errorMessage,
        },
      },
      error: isError,
      ...formik.getFieldProps(key),
    };
  };
