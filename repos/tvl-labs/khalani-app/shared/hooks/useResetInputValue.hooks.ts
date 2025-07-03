import { useEffect } from 'react'

export const useResetInputValue = (
  setInputValue: (value: React.SetStateAction<undefined>) => void,
  isCompleted?: boolean,
  setAdditionalInputValue?: (value: React.SetStateAction<undefined>) => void,
): void => {
  useEffect(() => {
    if (isCompleted) {
      setInputValue(undefined)
      setAdditionalInputValue?.(undefined)
    }
  }, [isCompleted, setInputValue, setAdditionalInputValue])
}
