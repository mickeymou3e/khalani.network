import { LpToken } from './lpToken/LpToken'

export const USDC_USDT_POOL_ID =
  '0xbdb2ade29dd506c115b6afc761862e2070e966fe000000000000000000000006'

export class Pool {
  constructor(public readonly id: string, public readonly lpToken: LpToken) {}
}
