export const getContractErrorMessage = (value: number): string => {
  switch (value) {
    case 304:
      return 'Amounts swapped may not be larger than 30% of total balance.'
    default:
      return 'Unknown contracts occurred'
  }
}

export const errorMessages = {
  NOT_ENOUGH_ASSETS: `You don't have enough available assets in your wallet`,
}
