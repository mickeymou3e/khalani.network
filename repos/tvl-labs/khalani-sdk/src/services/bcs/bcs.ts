import { bcs } from '@mysten/bcs'

export const WithdrawMtokensPayload = bcs.struct('WithdrawMtokensPayload', {
  address: bcs.vector(bcs.u8(), { length: 20 } as any),
  amount: bcs.vector(bcs.u8(), { length: 32 } as any),
  mtoken: bcs.vector(bcs.u8(), { length: 20 } as any),
  nonce: bcs.vector(bcs.u8(), { length: 32 } as any),
  chain_id: bcs.u64(),
})

export const CancelIntentPayload = bcs.struct('CancelIntentPayload', {
  intent_id: bcs.vector(bcs.u8(), { length: 32 } as any),
  nonce: bcs.vector(bcs.u8(), { length: 32 } as any),
  chain_id: bcs.u64(),
})
