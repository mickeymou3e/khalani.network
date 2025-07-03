import { useEffect } from "react";
import { useFormik } from "formik";

import { RequestStatusProps } from "@/definitions/types";
import { useAppSelector } from "@/store";
import { selectBackdropParams } from "@/store/backdrops";
import { selectRequestStatus } from "@/store/wallet";
import { authCodeSchema } from "@/utils/formik";

import { ChangeRoleBackdroppViews } from "../useChangeRoleBackdrop";

interface UseVerifyViewProps {
  setView: (view: ChangeRoleBackdroppViews) => void;
}

const initialValues = {
  code: "",
};

export const useVerifyView = ({ setView }: UseVerifyViewProps) => {
  const withdrawalStatus = useAppSelector(selectRequestStatus);
  const backdropParams = useAppSelector(selectBackdropParams);

  const handlePrimaryButtonClick = () => {
    setView(ChangeRoleBackdroppViews.Main);
  };

  const onSubmit = (values: { code: string }) => {
    const requestBody = {
      ...backdropParams,
      ...values,
    };

    // TODO: add api call function
    console.log(requestBody);
    setView(ChangeRoleBackdroppViews.Success);
  };

  useEffect(() => {
    if (withdrawalStatus === RequestStatusProps.SUCCESS) {
      setView(ChangeRoleBackdroppViews.Success);
    }
  }, [withdrawalStatus]);

  const formik = useFormik({
    initialValues,
    validationSchema: authCodeSchema,
    onSubmit,
  });

  return {
    formik,
    handlePrimaryButtonClick,
  };
};
