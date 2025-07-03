import { useFormik } from "formik";
import * as yup from "yup";

import { sendInvite } from "@/services/account";
import { useAppDispatch } from "@/store";
import { hideBackdrop } from "@/store/backdrops/backdrops.store";

import { InviteUserBackdropViews } from "../useInviteUserBackdrop";

interface UseVerifyViewProps {
  setView: (view: InviteUserBackdropViews) => void;
}

export const fiatWithdrawalSchema = yup.object({
  email: yup.string().required(":required"),
  userRole: yup.string().required(":required"),
});

const initialValues = { email: "", userRole: "" };

export const useMainView = ({ setView }: UseVerifyViewProps) => {
  const dispatch = useAppDispatch();

  const handleSelect = (value: any) => {
    formik.setFieldValue("userRole", value);
  };

  const onSubmit = async () => {
    const result = await dispatch(
      sendInvite({
        email: formik.values.email,
        role: formik.values.userRole,
      })
    );

    if ("data" in result) {
      setView(InviteUserBackdropViews.Success);
      return;
    }

    setView(InviteUserBackdropViews.Error);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: fiatWithdrawalSchema,
    onSubmit,
  });

  const handleSecondaryButtonClick = () => {
    dispatch(hideBackdrop());
  };

  return {
    formik,
    handleSecondaryButtonClick,
    handleSelect,
  };
};
