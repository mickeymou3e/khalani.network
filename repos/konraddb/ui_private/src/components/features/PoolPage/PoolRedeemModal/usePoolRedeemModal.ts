import { useAppDispatch, useAppSelector } from "@/store";
import { selectModalProps, setModalParams } from "@/store/ui";

export enum PoolRedeemModalViews {
  RedeemLoading = "RedeemLoading",
  RedeemSuccess = "RedeemSuccess",
  RedeemFailed = "RedeemFailed",
  PoolLoading = "PoolLoading",
  PoolSuccess = "PoolSuccess",
  PoolFailed = "PoolFailed",
}

const poolNamespace = "pool-page:deposit";
const redeemNamespace = "pool-page:redeem";

export const usePoolRedeemModal = () => {
  const dispatch = useAppDispatch();
  const { params: view = "" } = useAppSelector(selectModalProps);
  const isPool = [
    PoolRedeemModalViews.PoolLoading,
    PoolRedeemModalViews.PoolSuccess,
    PoolRedeemModalViews.PoolFailed,
  ].includes(view);
  const isSuccess = view?.includes("Success");
  const isFailed = view?.includes("Failed");
  const isLoading = view?.includes("Loading");
  const namespace = isPool ? poolNamespace : redeemNamespace;

  const clearUp = () => {
    dispatch(setModalParams(undefined));
  };

  return {
    view,
    namespace,
    isSuccess,
    isFailed,
    isLoading,
    clearUp,
  };
};
