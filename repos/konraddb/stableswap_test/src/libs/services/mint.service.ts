import { IMintRequest } from '@store/mint/mint.types'

const mint = (payload: IMintRequest): Promise<{ success: boolean }> => {
  console.log('Payload is:', payload)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      })
    }, 2000)
  })
}

export const mintService = {
  mint,
}
