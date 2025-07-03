import { useState } from "react";

import { useAppDispatch } from "@/store";
import { hideBackdrop } from "@/store/backdrops/backdrops.store";

export enum DeleteBackdropViews {
  Warning = "Warning",
  Verify = "Verify",
  Success = "Success",
}

export const useDeleteBackdrop = () => {
  const dispatch = useAppDispatch();

  const [view, setView] = useState(DeleteBackdropViews.Warning);

  const handleCloseBackdrop = () => {
    dispatch(hideBackdrop());
  };

  return {
    view,
    setView,
    handleCloseBackdrop,
  };
};
