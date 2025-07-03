export enum ToastVariant {
  Warning,
  Error,
  Success,
  Info,
}

export interface IToastProps {
  message?: string
  variant: ToastVariant
  onClick?: () => void
}
