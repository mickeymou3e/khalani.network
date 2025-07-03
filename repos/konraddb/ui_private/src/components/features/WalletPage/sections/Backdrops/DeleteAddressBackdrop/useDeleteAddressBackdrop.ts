import { useState } from "react";

export enum DeleteAddressBackdropViews {
  Verify = "Verify",
  Success = "Success",
  Error = "Error",
}

export const useDeleteAddressBackdrop = () => {
  const [view, setView] = useState(DeleteAddressBackdropViews.Verify);

  return {
    view,
    setView,
  };
};
