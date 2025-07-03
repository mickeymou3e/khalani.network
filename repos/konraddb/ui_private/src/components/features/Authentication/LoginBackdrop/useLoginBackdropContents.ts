import { useState } from "react";

export enum LoginBackdropViews {
  Main = "Main",
  Verify = "Verify",
  Success = "Success",
  Block = "Block",
}

export enum LoginBackdropViewsStepper {
  Main = "Main",
  Verify = "Verify",
}

export const useLoginBackdropContents = () => {
  const [view, setView] = useState(LoginBackdropViews.Main);

  const handleResetPassword = () => {};

  return {
    view,
    setView,
    handleResetPassword,
  };
};
