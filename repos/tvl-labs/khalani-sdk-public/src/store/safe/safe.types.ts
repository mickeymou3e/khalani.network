export interface SafeUserConfig {
  owners: string[]
  threshold: number
  saltNonce: string
}

export interface SafeSliceState {
  address: string | null
  deployed: boolean | null
  adapterAddress: string
}
