import { Backdrops } from "@/definitions/types";
import { selectUsers } from "@/services/admin/admin.api";
import { useAppDispatch, useAppSelector } from "@/store";
import { openBackdrop } from "@/store/backdrops";

export const useUsersList = () => {
  const dispatch = useAppDispatch();
  const appUsers = useAppSelector(selectUsers);

  const handleActionButton = () => {
    dispatch(openBackdrop(Backdrops.CHANGE_ROLE_BACKDROP));
  };

  return {
    appUsers,
    handleActionButton,
  };
};
