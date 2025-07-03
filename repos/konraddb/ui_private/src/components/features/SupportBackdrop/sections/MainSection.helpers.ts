import { FormikProps } from "formik";
import * as yup from "yup";

import { formNamespace, namespace } from "../config";

export const formSchema = yup.object({
  email: yup.string().email(":emailInvalid").required(":required"),
  subject: yup.string().required(":required"),
  message: yup.string().required(":required"),
});

export const getInputProps = (
  t: TFunc,
  formik: FormikProps<any>,
  key: string
) => {
  const isError = Boolean(formik.touched[key] && formik.errors[key]);
  const errorMessage = isError
    ? t(`${formNamespace}${formik.errors[key]}`)
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

export const initialValues = ({ email = "", subject = "", message = "" }) => ({
  email,
  subject,
  message,
});
