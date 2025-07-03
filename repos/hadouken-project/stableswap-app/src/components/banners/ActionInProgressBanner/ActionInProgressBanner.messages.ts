import { ActionInProgress } from '@interfaces/action'

const ANOTHER_ACTION_IN_PROGRESS = (action: ActionInProgress): string =>
  `There is another ${action} action in progress`

export const messages = {
  ANOTHER_ACTION_IN_PROGRESS,
}
