import { IRedeemRequest } from '@containers/RedeemContainer/RedeemContainer.types'

const redeem = (payload: IRedeemRequest): Promise<{ success: boolean }> => {
  console.log('Payload is:', payload)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      })
    }, 2000)
  })
}

export const redeemService = {
  redeem,
}
