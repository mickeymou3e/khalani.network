import { useAppDispatch } from "@/store";
import { hideBackdrop } from "@/store/backdrops";
import { resetWalletRequestStatus } from "@/store/wallet";

import { RequestWhitelistAddressBackdropViews } from "../useRequestWhitelistAddressBackdrop";

interface UseErrorViewProps {
  setView: (view: RequestWhitelistAddressBackdropViews) => void;
}

export const useErrorView = ({ setView }: UseErrorViewProps) => {
  const dispatch = useAppDispatch();

  const handleTryAgain = () => {
    setView(RequestWhitelistAddressBackdropViews.Verify);
  };

  const handleCancel = () => {
    dispatch(hideBackdrop());
    dispatch(resetWalletRequestStatus());
  };

  return {
    handleTryAgain,
    handleCancel,
  };
};
