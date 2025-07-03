export const SECOND = 1
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const WEEK = DAY * 7

export const getTimestampTimeAgo = (timeAgo: number): number => {
  const timestampDayAgo = Math.floor(Date.now() / 1000) - timeAgo

  return timestampDayAgo
}
