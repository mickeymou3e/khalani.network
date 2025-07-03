import { useState } from "react";

export enum RequestWithdrawalBackdropViews {
  Verify = "Verify",
  Success = "Success",
  Error = "Error",
}

export const useRequestWithdrawalBackdrop = () => {
  const [view, setView] = useState(RequestWithdrawalBackdropViews.Verify);

  return {
    view,
    setView,
  };
};
