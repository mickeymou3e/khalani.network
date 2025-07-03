import { useFormik } from "formik";

import { requestWithdrawal } from "@/services/wallet";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectBackdropParams } from "@/store/backdrops";
import { authCodeSchema } from "@/utils/formik";

import { RequestWithdrawalBackdropViews } from "../useRequestWithdrawalBackdrop";

interface UseVerifyViewProps {
  setView: (view: RequestWithdrawalBackdropViews) => void;
}

const initialValues = {
  code: "",
};

export const useVerifyView = ({ setView }: UseVerifyViewProps) => {
  const dispatch = useAppDispatch();

  const backdropParams = useAppSelector(selectBackdropParams);

  const onSubmit = async (values: { code: string }) => {
    const requestBody = {
      ...backdropParams,
      ...values,
    };

    const result = await dispatch(requestWithdrawal(requestBody));

    if ("data" in result) {
      setView(RequestWithdrawalBackdropViews.Success);
      return;
    }

    setView(RequestWithdrawalBackdropViews.Error);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: authCodeSchema,
    onSubmit,
  });

  return {
    formik,
  };
};
