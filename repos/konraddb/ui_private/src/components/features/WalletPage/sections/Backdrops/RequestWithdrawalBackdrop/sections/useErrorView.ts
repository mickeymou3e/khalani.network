import { useAppDispatch } from "@/store";
import { hideBackdrop } from "@/store/backdrops";

import { RequestWithdrawalBackdropViews } from "../useRequestWithdrawalBackdrop";

interface UseErrorViewProps {
  setView: (view: RequestWithdrawalBackdropViews) => void;
}

export const useErrorView = ({ setView }: UseErrorViewProps) => {
  const dispatch = useAppDispatch();

  const handleTryAgain = () => {
    setView(RequestWithdrawalBackdropViews.Verify);
  };

  const handleCancel = () => {
    dispatch(hideBackdrop());
  };

  return {
    handleTryAgain,
    handleCancel,
  };
};
