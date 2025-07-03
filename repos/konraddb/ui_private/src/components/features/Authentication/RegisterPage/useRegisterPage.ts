import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as yup from "yup";

import { createAccount, getTotpSecret } from "@/services/register";
import { CreateAccountErrorCodes } from "@/services/register/register.types";
import { useAppDispatch } from "@/store";

import { RegisterPageProps } from "./RegisterPage";

const validationSchema = (isTwoFaView: boolean) =>
  yup.object({
    firstName: yup.string().required(":required"),
    password: yup
      .string()
      .required(":required")
      .min(8, ":tooShortPassword")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, ":passwordRequirements"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), undefined], ":notMatchingPassword")
      .required(":required"),
    ...(isTwoFaView && {
      twoFaCode: yup.string(),
    }),
  });

const initialValues = {
  firstName: "",
  password: "",
  confirmPassword: "",
  twoFaCode: "",
};

export const replaceSpaceWithPlus = (inputString: string) =>
  inputString.replace(/ /g, "+");

export enum RegisterViews {
  Main = "Main",
  TwoFA = "TwoFA",
  Completed = "Completed",
}

export type RegisterFormProps = {
  firstName: string;
  password: string;
  confirmPassword: string;
  twoFaCode: string;
};

export const useRegisterPage = (props: RegisterPageProps) => {
  const [view, setView] = useState(props.view || RegisterViews.Main);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const inviteCode = router.query.invite as string;
  const email = router.query.email as string;

  const formattedEmail = replaceSpaceWithPlus(email);

  useEffect(() => {
    dispatch(getTotpSecret(inviteCode));
  }, []);
  const handleShowInitialScreen = () => {
    setView(RegisterViews.Main);
  };

  const handleNextView = () => {
    setView(RegisterViews.TwoFA);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema(view === RegisterViews.TwoFA),
    onSubmit: async (formValues) => {
      const body = {
        email: formattedEmail,
        name: formValues.firstName,
        invite_code: inviteCode || "",
        password: formValues.password,
        totp_code: formValues.twoFaCode.toString(),
      };

      formik.setSubmitting(true);

      const result = await dispatch(createAccount(body));

      if ("data" in result) {
        setView(RegisterViews.Completed);
        return;
      }

      const errorCode = (result.error as any).data
        .code as keyof typeof CreateAccountErrorCodes;

      formik.setErrors({
        twoFaCode: CreateAccountErrorCodes[errorCode] ?? errorCode,
      });
    },
  });

  return {
    view,
    formik,
    setView,
    handleShowInitialScreen,
    handleNextView,
  };
};
