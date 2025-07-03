// TODO fill up errors
export const getContractErrorMessage = (value: number): string => {
  switch (value) {
    case 0:
      return 'Addition result overflow'
    case 1:
      return 'Subtraction result overflow'
    case 2:
      return 'Subtraction result underflow'
    case 3:
      return 'Multiplication result overflow'
    case 4:
      return 'Cannot divide by zero'
    case 5:
      return 'Multiplication overflow during fixed point division'
    case 6:
    case 7:
    case 100:
    case 8:
    case 9:
      return 'Out of bounds - cannot calculate the amount'
    case 101:
    case 102:
      return 'Tokens must be sorted in address order on pool registration'
    case 103:
      return 'Arguments mismatch - invalid length'
    case 104:
      return 'Token address cannot be zero address'
    case 200:
      return 'Pool must contain at least two tokens'
    case 201:
      return 'Token count exceeds the maximum allowed for a given pool type'
    case 202:
      return 'Swap fee percentage is too high'
    case 203:
      return 'Swap fee percentage is too low'
    case 204:
      return 'Small amount of BPT is minted. Initial balances are too small'
    case 205:
      return 'Transaction must be called by Vault'
    case 206:
      return 'Pool must be initialized with a initial join'
    case 207:
      return 'Slippage protection check failed on pool exit'
    case 208:
      return 'Slippage protection check failed on pool join'
    case 210:
      return 'Pool with the two tokens specialization must have exactly two tokens'
    case 300:
    case 301:
      return 'Amplification factor out of range'
    case 302:
      return 'Invalid minimum weight for weighted pool'
    case 303:
      return 'Invalid count of stable tokens'
    case 304:
    case 305:
      return 'Amounts swapped may not be larger than 30% of total balance.'
    case 306:
      return 'Disproportionate exit unbalanced the pool too much'
    case 307:
      return 'Disproportionate join unbalanced the pool too much'
    case 308:
      return 'Normalized weights must be rounded value'
    case 309:
      return 'Invalid token'
    case 310:
      return 'Unhandled kind of join to pool'
    case 311:
      return 'Pool balance must be greater than 0'
    case 312:
      return 'The timestamp when querying the oracle must be in the past'
    case 313:
      return 'Cannot query an oracle with no data'
    case 314:
      return "Cannot query before the oracle's earliest data sample"
    case 315:
      return 'Cannot query a sample outside the buffer'
    case 316:
      return 'Oracle query window must have non-zero duration'
    case 317:
      return 'Amplification parameter change has less than the minimum duration'
    case 318:
      return 'Cannot start an amplification parameter update because one is already ongoing'
    case 319:
      return 'The requested amplification parameter change is too fast'
    case 320:
      return "Cannot cancel an update because there isn't one"
    case 321:
      return 'Stable invariant did not converge'
    case 322:
      return 'Stable get balance did not converge'
    case 323:
      return 'Invalid Relayer contract'
    case 324:
      return 'Base Pool - relayer not called'
    case 325:
      return 'Rebalancing relayer reentered'
    case 326:
      return 'Start time was greater than end time in a gradual weights update'
    case 327:
      return 'Swaps disabled'
    case 328:
      return 'Caller is not LBP owner'
    case 329:
      return "Rate returned from provider doesn't fit in 128 bits"
    case 330:
      return 'Investment pools only allow proportional joins and exits when swaps are disabled'
    case 331:
      return 'Gradual weight update duration too short'
    case 332:
      return 'Linear Pool - invalid operating range'
    case 333:
      return 'Linear Pool max balance must fit in 112 bits'
    case 334:
    case 339:
      return 'Unhandled joins and exits - pool type specific'
    case 335:
      return 'Cannot reset Linear Pool targets if pool is unbalanced'
    case 336:
      return 'Unhandled exits - pool type specific'
    case 337:
      return 'Management fees can only be collected by the pool owner'
    case 338:
      return 'Exceeds max management swap fee percentage'
    case 400:
      return 'Reentrancy'
    case 401:
      return 'Sender not allowed'
    case 402:
      return 'Paused'
    case 403:
      return 'Pause window expired'
    case 404:
      return 'Max pause window duration'
    case 405:
      return 'Max buffer period duration'
    case 406:
      return 'Insufficient balance'
    case 407:
      return 'Insufficient allowance'
    case 408:
      return 'ERC20 transfer from zero address'
    case 409:
      return 'ERC20 transfer to zero address'
    case 410:
      return 'ERC20 mint to zero address'
    case 411:
      return 'ERC20 burn from zero address'
    case 412:
      return 'ERC20 approve from zero address'
    case 413:
      return 'ERC20 approve to zero address'
    case 414:
      return 'ERC20 transfer exceeds allowance'
    case 415:
      return 'ERC20 decreased allowance bellow zero'
    case 416:
      return 'ERC20 transfer exceeds balance'
    case 417:
      return 'ERC20 burn exceeds allowance'
    case 418:
      return 'Safe ERC20 call failed'
    case 419:
      return 'Address insufficient balance'
    case 420:
      return 'Address cannot send value'
    case 421:
      return 'Safe cast value cannot fit INT256'
    case 422:
    case 423:
      return 'Caller must be an admin'
    case 424:
      return 'Callers can only renounce for their own account'
    case 425:
      return 'Buffer period expired'
    case 426:
      return 'Caller is not owner'
    case 427:
      return 'New owner is zero'
    case 428:
      return 'Code deployment failed'
    case 429:
      return 'Call to non contract'
    case 430:
      return 'Low level call failed'
    case 500:
      return 'Invalid pool id'
    case 501:
      return 'Can be called only by pool'
    case 502:
      return 'Sender is not asset manager'
    case 503:
      return 'Relayers must be allowed by both governance and the user account'
    case 504:
      return 'Invalid signature'
    case 505:
      return 'Exit would yield fewer than the user-supplied minimum tokens out'
    case 506:
      return 'Join would cost more than the user-supplied maximum tokens in'
    case 507:
      return 'Swap violates limits'
    case 508:
      return 'Swap transaction not mined within the specified deadline'
    case 509:
      return 'Cannot swap same token'
    case 510:
      return 'A batch swa must start with a non-zero amount in'
    case 511:
      return 'Malconstructed multihop swap'
    case 513:
      return 'Insufficient internal balance'
    case 514:
      return 'Cannot transfer native ETH to/from internal balance'
    case 515:
      return 'Flashloan transactions must repay the loan in the same transaction'
    case 516:
      return 'Insufficient ETH'
    case 518:
      return 'Relayers cannot receive ETH directly'
    case 519:
      return 'Internal Balance transfer cannot use ETH'
    case 520:
      return 'Tokens mismatch'
    case 521:
      return 'Token not registered'
    case 522:
      return 'Token already registered'
    case 523:
      return 'Tokens already set'
    case 524:
      return 'Tokens length must be two'
    case 525:
      return 'Non zero token balance'
    case 526:
      return 'Balance total overflow'
    case 527:
      return 'Pool has no tokens'
    case 528:
      return 'Insufficient flash loan balance'
    case 600:
      return 'Swap fee percentage too high'
    case 601:
      return 'Flash loan fee percentage too high'
    case 602:
      return 'Insufficient flash loan fee amount'
    default:
      return 'Unknown error occurred'
  }
}

export const getBalancerError = (error: string): string | null => {
  const splittedError = error.split('BAL#')
  if (splittedError?.[1]) {
    const balancerError = Number(splittedError?.[1].split('"')[0])
    if (balancerError >= 0 && balancerError <= 602) {
      return getContractErrorMessage(balancerError)
    }
  }

  return null
}

export const errorMessages = {
  NOT_ENOUGH_ASSETS: `You don't have enough available assets in your wallet`,
}
