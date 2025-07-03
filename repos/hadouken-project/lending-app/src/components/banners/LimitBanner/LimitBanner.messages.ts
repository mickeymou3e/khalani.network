import { ActionInProgress } from '@constants/Action'

const LIMIT_REACHED = 'Limit has been reached'
const LIMIT = (
  limit: string,
  userLimit: string,
  action?: ActionInProgress,
): string =>
  `${action} is limited to ${limit}. You can deposit up to ${userLimit}`

export const messages = {
  LIMIT_REACHED,
  LIMIT,
}
