import { useEffect, useState } from "react";

import { useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";

export const useLoggedOutEffect = (callback: () => void) => {
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const [wasloggedIn, setWasLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    !wasloggedIn && setWasLoggedIn(isLoggedIn);
  }, [isLoggedIn, wasloggedIn]);

  useEffect(() => {
    if (isLoggedIn || !wasloggedIn) return;

    setWasLoggedIn(false);

    callback();
  }, [isLoggedIn]);
};
