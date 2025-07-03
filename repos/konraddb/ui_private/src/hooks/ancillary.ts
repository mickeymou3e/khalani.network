import { useEffect } from "react";

import { useAppDispatch } from "@/store";
import { subscribeJasminePoolDeposits } from "@/store/ancillary";

export const useAncillarySubscriptions = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const jasminePoolDepositsSubscription = dispatch(
      subscribeJasminePoolDeposits()
    );

    return () => {
      jasminePoolDepositsSubscription.unsubscribe();
    };
  }, [dispatch]);
};
