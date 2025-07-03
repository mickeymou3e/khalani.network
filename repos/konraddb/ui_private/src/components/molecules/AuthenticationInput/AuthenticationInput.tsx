import { FormikProps } from "formik";
import { useTranslation } from "next-i18next";

import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

import { InputBase, PasswordInput } from "@/components/molecules";

export interface AuthenticationInputProps {
  formikId: string;
  placeholder?: string;
  namespace: string;
  formik: FormikProps<any>;
  password?: boolean;
  InputProps?: any;
}

const AuthenticationInput = ({
  formikId,
  placeholder = "",
  namespace,
  formik,
  password = false,
  ...props
}: AuthenticationInputProps) => {
  const { t } = useTranslation(namespace);

  if (password === true) {
    return (
      <PasswordInput
        {...formik.getFieldProps(formikId)}
        placeholder={placeholder}
        sx={{ marginTop: 2, marginBottom: 3 }}
        BottomLabelProps={{
          LabelProps: {
            value:
              formik.touched[formikId] && formik.errors[formikId]
                ? t(`${namespace}${formik.errors[formikId]}`)
                : "",
          },
          error: Boolean(formik.touched[formikId] && formik.errors[formikId]),
        }}
        error={formik.touched[formikId] && !!formik.errors[formikId]}
        data-testid={`login-${formikId}`}
        {...props}
      />
    );
  }

  return (
    <InputBase
      {...formik.getFieldProps(formikId)}
      placeholder={placeholder}
      sx={{ marginTop: 2, marginBottom: 3 }}
      BottomLabelProps={{
        LabelProps: {
          value:
            formik.touched[formikId] && formik.errors[formikId]
              ? t(`${namespace}${formik.errors[formikId]}`)
              : "",
        },
        error: Boolean(formik.touched[formikId] && formik.errors[formikId]),
      }}
      error={formik.touched[formikId] && !!formik.errors[formikId]}
      InputProps={{
        endAdornment:
          formik.isValid && formik.touched.code ? (
            <VerifiedOutlinedIcon sx={{ color: "primary.accent" }} />
          ) : null,
      }}
      data-testid={`login-${formikId}`}
      {...props}
    />
  );
};

export default AuthenticationInput;
