import { Backdrops } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectNeutralFeatures } from "@/store/auth";
import { openBackdrop } from "@/store/backdrops";

export const useRoles = () => {
  const dispatch = useAppDispatch();
  const featureFlags = useAppSelector(selectNeutralFeatures);

  const handleSendInvite = () => {
    dispatch(openBackdrop(Backdrops.INVITE_USER_BACKDROP));
  };

  return {
    inviteEnabled: featureFlags.invite,
    handleSendInvite,
  };
};
