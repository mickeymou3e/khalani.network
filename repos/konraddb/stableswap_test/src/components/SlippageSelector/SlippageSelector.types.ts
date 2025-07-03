export interface ISlippageSelectorProps {
  percentageOptions: number[]
  initialPercentage?: number
  onChange?: (percentage: number | null) => void
}
