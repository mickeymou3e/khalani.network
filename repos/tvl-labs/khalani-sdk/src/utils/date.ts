export const HOUR = 3600
export const NUMBER_OF_WEEKS_IN_YEAR = 52

export const formatTimeAgo = (timestamp: string) => {
  const now = Date.now()
  const diff = now - parseInt(timestamp) * 1000
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} d ago`
  } else if (hours > 0) {
    return `${hours} h ago`
  } else if (minutes > 0) {
    return `${minutes} min ago`
  } else {
    return `${seconds} s ago`
  }
}

export const getTimestampTimeAgo = (timeAgo: number): number => {
  const timestampDayAgo = Math.floor(Date.now() / 1000) - timeAgo

  return timestampDayAgo
}
