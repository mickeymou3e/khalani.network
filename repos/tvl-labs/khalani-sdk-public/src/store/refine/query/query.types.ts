import { Intent } from '@store/swaps'

export type QueryRefineParams = string
export type QueryRefineResult = Intent | QueryRefineErrors

export enum QueryRefineErrors {
  RefinementNotFound = 'RefinementNotFound',
}
