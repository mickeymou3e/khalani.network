import { ESdkKeys } from '@tvl-labs/sdk'

export enum EKeys {
  InitializeStore = 'InitializeStore',
  Wallet = 'Wallet',
  History = 'History',
  Notification = 'Notification',
}

export const StoreKeys = { ...EKeys, ...ESdkKeys }
export type StoreKeys = EKeys | ESdkKeys
