import { useEffect } from "react";

import { RequestStatusProps } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetWalletRequestStatus, selectRequestStatus } from "@/store/wallet";

export const useResetRequestStatus = () => {
  const dispatch = useAppDispatch();

  const requestStatus = useAppSelector(selectRequestStatus);

  useEffect(() => {
    if (
      [RequestStatusProps.SUCCESS, RequestStatusProps.FAILED].includes(
        requestStatus
      )
    ) {
      setTimeout(() => {
        dispatch(resetWalletRequestStatus());
      }, 1000);
    }
  }, [requestStatus]);
};
