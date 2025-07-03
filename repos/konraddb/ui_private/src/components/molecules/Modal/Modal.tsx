import { useEffect } from "react";

import { ModalVariants } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeModal, selectModalProps } from "@/store/ui";

import { ModalBase, ModalBaseProps } from "./ModalBase";

export type ModalProps = {
  variant: ModalVariants | string;
  onClear?: () => void;
} & ModalBaseProps;

const Modal = ({ variant, onClear, ...rest }: ModalProps) => {
  const dispatch = useAppDispatch();
  const { variant: modalVariant } = useAppSelector(selectModalProps);

  useEffect(() => {
    if (variant !== modalVariant) return;

    return () => {
      onClear?.();
    };
  }, [variant, modalVariant]);

  if (variant !== modalVariant) return null;

  const handleClose = () => {
    dispatch(closeModal());
  };

  return <ModalBase opened onClose={handleClose} {...rest} />;
};

export default Modal;
