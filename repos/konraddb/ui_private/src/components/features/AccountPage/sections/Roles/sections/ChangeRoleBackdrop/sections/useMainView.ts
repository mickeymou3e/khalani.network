import { useAppDispatch } from "@/store";
import { hideBackdrop } from "@/store/backdrops/backdrops.store";

import { ChangeRoleBackdroppViews } from "../useChangeRoleBackdrop";

interface UseVerifyViewProps {
  setView: (view: ChangeRoleBackdroppViews) => void;
  setCredentials: (credentials: any) => void;
}

export const useMainView = ({
  setView,
  setCredentials,
}: UseVerifyViewProps) => {
  const dispatch = useAppDispatch();

  const handlePrimaryButtonClick = () => {
    setView(ChangeRoleBackdroppViews.Verify);
    // TODO: delete it if it turns out to be unnecessary
    setCredentials({});
  };

  const handleSecondaryButtonClick = () => {
    dispatch(hideBackdrop());
  };

  return {
    handlePrimaryButtonClick,
    handleSecondaryButtonClick,
  };
};
