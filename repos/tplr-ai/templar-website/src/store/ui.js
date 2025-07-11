import { create } from 'zustand'
import { useEffect } from 'react'

const useUIStore = create(() => ({
  theme: '',
}))

export default useUIStore

export const UISideEffects = () => {
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return null
}
