import { BackstopToggle } from './Backstop.types'

export const TOGGLE_OPTIONS_LIQUIDITY = [
  { id: BackstopToggle.Stake, name: 'Stake', disabled: false },
  { id: BackstopToggle.Unstake, name: 'Unstake', disabled: false },
]

export const LIQUIDATIONS_LIMIT = 5
