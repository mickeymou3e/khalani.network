import { lockIntentRequest } from '@services/medusa/lock.service'
;(async () => {
  const intentId = ['0x']

  await lockIntentRequest(intentId)
})()
