export const MESSAGES = {
  TITLE: 'Lockdrop - Phase',
  LOCKDROPS: 'All lockdrops',
  REWARD_POOL: 'Total reward - ',
  CAPITAL_LOCKED: 'Capital Locked',
  TOTAL_VALUE_LOCKED: 'Total Value Locked - ',
  INTERLUDIUM_ONE: 'Lockdrop - Between Phases ( 1-2 )',
  INTERLUDIUM_TWO: 'Lockdrop - Between Phases ( 2-3 )',
  INTERLUDIUM_DESCRIPTION:
    'The Lockdrop is currently in transition between phases. Keep an eye out for the upcoming phase, set to begin shortly.',
  LOCKDROP_PRELUDIUM: 'Lockdrop - Preludium',

  NO_RESULTS: "You haven't locked any assets",
  NOT_AVAILABLE_IN_THIS_PHASE: 'Not available in this phase',

  TIME_LEFT: 'Time left',
  CURRENT_DAY: 'Currently On Day: ',

  UNLOCK: 'Unlock',
  UNLOCKED: 'Unlocked',

  LOCK: 'Lock',
  LOCK_IN_DAYS: 'Locks In Days',
  LOCK_DAY_BOOST_WEIGHT: 'Day Boost Weight =',
  LOCK_BOOST_WEIGHT: 'Lock Duration Weight =',
  LOCK_ESTIMATED_REWARD: 'Your estimated reward',

  DEPOSIT: 'Deposit',
  DEPOSIT_HEADING: 'Deposit to pool',
  DEPOSIT_DESCRIPTION: (
    firstTokenSymbol: string,
    secondTokenSymbol: string,
  ): string =>
    `Deposit ${firstTokenSymbol} and ${secondTokenSymbol} to assist Hadouken in bootstrapping liquidity, and earn additional HDK rewards.`,

  DEPOSIT_BALANCE_TITLE: 'Deposited tokens',
  DEPOSIT_BALANCE_DESCRIPTION:
    'The current deposit balance will be transferred to the pool upon the completion of Phase 2',
  ASSET: 'ASSET',
  BALANCE: 'BALANCE',
  YOUR_SHARE: 'YOUR SHARE',

  DISTRIBUTED: 'Distributed on ',

  HOW_IT_WORKS_TITLE: 'How does boost work in Phase 1?',
  MULTIPLIER: 'Multiplier',
  LOCK_PERIOD: 'Lock period',
  PARTICIPATING_HOURS: 'Participating Hours',

  HDK_EARNED: 'HDK Earned',
  HDK_EARNED_DESCRIPTION:
    'Embrace the benefits of your earnings by claiming your HDK tokens, and seamlessly become an integral part of the Hadouken community.',
  CLAIM: 'Claim',
  CLAIMED: 'Claimed',
  AVAILABLE_TO_CLAIM: 'Available to claim',
  TOTAL_TO_CLAIM: 'Total to claim',

  EXAMPLE: 'Example:',

  EXAMPLE_DESCRIPTION:
    "Let's consider a scenario with 30,000 HDK tokens distributed on the current chain, where 55% of the tokens were deposited in Phase 2. In this case, the participation rate is 55%, so an additional 8.33% (equivalent to 2,499 HDK tokens) is distributed as a reward.",
  PARTICIPATION_BONUS: 'Participation Bonus',
  PARTICIPATION_RATE: 'Participation Rate',
  BONUS_ALLOCATION: 'Bonus allocation',
  PARTICIPATION_RATE_DESCRIPTION:
    'The participation bonus is designed to reward users based on their engagement and commitment to holding HDK tokens. Following table shows bonus HDK distribution',
  BONUS_HDK: 'Bonus HDK',

  ENTRY_DAYS_DESCRIPTION: `Multiply your drops by locking your capital early. Double the impact on your locked funds if you lock within the first 24 hours!`,
  LOCK_PERIOD_DESCRIPTION: `The longer you're willing to commit your funds, the more you'll be entitled to the drop reward. You can lock your funds up to 1 year to 2x your return. This is our way of rewarding the most incentive-aligned users. Once the locking period is over, you can withdraw all your locked funds.`,

  LP_VESTING: 'LP Vesting',
  LP_VESTING_DESCRIPTION: `After a three-month vesting period, LP tokens of HDK Pool can be claimed, providing you with full control over your earnings and shraes in pool.`,

  PRELUDIUM_TITLE: `Lockdrop is a blockchain mechanism that allows users to participate actively in a network's ecosystem by "locking" their tokens for a specified duration. Whether it's a promising DeFi project, a blockchain upgrade, or a new governance proposal, Lockdrop is your key to engaging with the crypto community.`,
}
