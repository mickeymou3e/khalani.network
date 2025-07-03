import { formatDistanceStrict } from 'date-fns'
import locale from 'date-fns/locale/en-US'

import { BigDecimal } from '@utils/math'

export const SECOND = 1
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const WEEK = DAY * 7
export const NUMBER_OF_WEEKS_IN_YEAR = 52

export const WEEK_BIG_DECIMAL = BigDecimal.from(7, 0)
export const YEAR_BIG_DECIMAL = BigDecimal.fromString('365.25', 2)

export const getTimestampTimeAgo = (timeAgo: number): number => {
  const timestampDayAgo = Math.floor(Date.now() / 1000) - timeAgo

  return timestampDayAgo
}

type FormatDistanceOptions = {
  addSuffix?: boolean | undefined
  comparison?: number | undefined
  locale?: Locale | undefined
}

// This is map (key,value)
// keys are from date-fns package but we override values. (e.g instead of using "days" we are using "d")
// It allows to get shorten unit (check formatDistance function)
const formatDistanceLocale = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}min',
  xMinutes: '{{count}}min',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}mo',
  xMonths: '{{count}}mo',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
}

// Custom function to formatDistance.
// This is copy from date-fns package but we use replace function
// and our custom formatDistanceLocale object to get shorten unit
// e.g day => d | month => m | year => y
// seconds => s | minutes => m | hours => h
function formatDistance(
  token: keyof typeof formatDistanceLocale,
  count: number,
  options?: FormatDistanceOptions,
): string {
  options = options || {}

  const result = formatDistanceLocale[token].replace(
    '{{count}}',
    count.toString(),
  )

  if (options?.addSuffix) {
    if (options && options.comparison && options.comparison > 0) {
      return 'in ' + result
    } else {
      return result + ' ago'
    }
  }

  return result
}

// This function returns distance between two dates.
export function formatDistanceShorten(
  targetDate: number | Date,
  currentDate: number | Date,
  options: { addSuffix: boolean },
): string {
  return formatDistanceStrict(targetDate, currentDate, {
    addSuffix: options.addSuffix,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}

export const formatDateWithZero = (time: number): string => {
  if (time < 10) return '0' + time.toString()

  return time.toString()
}

export const formatLockedDistance = (
  currentDate: number,
  lockedDuration: number,
): string => {
  const timeDifference = Math.abs(lockedDuration - currentDate)

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))

  return `${days}d ${hours}h ${minutes}m`
}
