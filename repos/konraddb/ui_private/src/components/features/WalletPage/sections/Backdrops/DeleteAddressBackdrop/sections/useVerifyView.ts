import { requestAddressDelete } from "@/services/wallet/wallet.api";
import { useAppDispatch, useAppSelector } from "@/store";
import { hideBackdrop, selectBackdropParams } from "@/store/backdrops";

import { DeleteAddressBackdropViews } from "../useDeleteAddressBackdrop";

interface UseVerifyViewProps {
  setView: (view: DeleteAddressBackdropViews) => void;
}

export const useVerifyView = ({ setView }: UseVerifyViewProps) => {
  const dispatch = useAppDispatch();

  const backdropParams = useAppSelector(selectBackdropParams);

  const primaryButtonAction = async () => {
    const requestBody = {
      addressId: backdropParams.code,
    };

    const result = await dispatch(requestAddressDelete(requestBody));

    if ("data" in result) {
      setView(DeleteAddressBackdropViews.Success);
      return;
    }

    setView(DeleteAddressBackdropViews.Error);
  };

  const secondaryButtonAction = () => {
    dispatch(hideBackdrop());
  };

  return {
    primaryButtonAction,
    secondaryButtonAction,
  };
};
