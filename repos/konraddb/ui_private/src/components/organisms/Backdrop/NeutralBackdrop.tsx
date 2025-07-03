import React from "react";

import { Backdrops } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearTokens } from "@/store/auth";
import { selectCurrentBackdrop } from "@/store/backdrops/backdrops.selectors";
import { hideBackdrop } from "@/store/backdrops/backdrops.store";
import { setSelectedAsset } from "@/store/wallet";

import BackdropBase from "./BackdropBase";

interface BackdropsMapper {
  [key: string]: React.FC;
}

export interface BackdropProps {
  backdropsMapper: BackdropsMapper;
}

const NeutralBackdrop = ({ backdropsMapper }: BackdropProps) => {
  const dispatch = useAppDispatch();
  const currentBackdrop = useAppSelector(selectCurrentBackdrop);

  const handleClose = () => {
    dispatch(hideBackdrop());

    if (currentBackdrop === Backdrops.REQUEST_WHITELIST_ADDRESS) {
      dispatch(setSelectedAsset(""));
    }
    if (currentBackdrop === Backdrops.LOGIN) {
      dispatch(clearTokens());
    }
  };

  if (!currentBackdrop || !backdropsMapper[currentBackdrop]) {
    return null;
  }

  const Content = backdropsMapper[currentBackdrop] as React.FC;

  return (
    <BackdropBase opened={Boolean(currentBackdrop)} onClose={handleClose}>
      <Content />
    </BackdropBase>
  );
};

export default NeutralBackdrop;
