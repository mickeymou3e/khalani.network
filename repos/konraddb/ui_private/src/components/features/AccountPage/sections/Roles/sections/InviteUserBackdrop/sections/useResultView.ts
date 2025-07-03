import { useEffect } from "react";

import { useAppDispatch } from "@/store";
import { resetWalletRequestStatus } from "@/store/wallet";

export const useResultView = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetWalletRequestStatus());
  }, []);

  return null;
};
