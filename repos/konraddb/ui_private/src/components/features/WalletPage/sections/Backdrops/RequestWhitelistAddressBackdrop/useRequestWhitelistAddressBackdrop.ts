import { useState } from "react";

export enum RequestWhitelistAddressBackdropViews {
  Main = "Main",
  Verify = "Verify",
  Success = "Success",
  Error = "Error",
}

export const backdropinitialValues = {
  currency: "",
  address: "",
  label: "",
  memo: "",
  totp_code: "",
  wallet_code: "",
};

export const useRequestWhitelistAddressBackdrop = () => {
  const [view, setView] = useState(RequestWhitelistAddressBackdropViews.Main);
  const [credentials, setCredentials] = useState(backdropinitialValues);

  return {
    view,
    setView,
    credentials,
    setCredentials,
  };
};
