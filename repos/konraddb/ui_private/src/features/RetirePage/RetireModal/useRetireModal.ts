import { useState } from "react";

export enum RetireModalViews {
  None = "None",
  RetireCredits = "RetireCredits",
  Loading = "Loading",
  Success = "Success",
  Failed = "Failed",
}

export const useRetireModal = () => {
  const [view, setView] = useState(RetireModalViews.RetireCredits);

  const clearUp = () => {
    setView(RetireModalViews.RetireCredits);
  };

  return {
    view,
    setView,
    clearUp,
  };
};
