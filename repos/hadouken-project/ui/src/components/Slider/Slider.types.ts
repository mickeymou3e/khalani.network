export interface ISliderProps {
  value: number
  setValue?: (
    event: Event,
    value: number | Array<number>,
    activeThumb: number,
  ) => void
  title?: string
}
