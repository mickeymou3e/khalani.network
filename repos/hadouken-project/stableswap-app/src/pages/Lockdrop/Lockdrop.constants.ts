import { LockLength, PhaseOneDays } from '@store/lockDrop/lockDrop.types'

export const LOCK_DAYS_TOGGLES = [
  { id: LockLength.TwoWeeks.toString(), name: '14' },
  { id: LockLength.OneMonth.toString(), name: '30' },
  { id: LockLength.FourMonths.toString(), name: '120' },
  { id: LockLength.OneYear.toString(), name: '365' },
]

export const LOCK_DURATION_BOOST = {
  [LockLength.TwoWeeks]: 0.2,
  [LockLength.OneMonth]: 0.6,
  [LockLength.FourMonths]: 1,
  [LockLength.OneYear]: 2,
}

export const DAY_BOOST = {
  [PhaseOneDays.First]: 2,
  [PhaseOneDays.Second]: 1.5,
  [PhaseOneDays.Third]: 1,
}

export const LOCK_LENGTH_DAYS = {
  [LockLength.TwoWeeks]: 14,
  [LockLength.OneMonth]: 30,
  [LockLength.FourMonths]: 120,
  [LockLength.OneYear]: 365,
}

export const DEPOSIT_TOGGLES = [
  { id: 'my-deposits', name: 'My deposit balance' },
  { id: 'all-deposits', name: 'Total deposit balance' },
]

export const PARTICIPATION_RATE = [
  {
    participationRate: '90 - 100',
    bonusAllocation: 5,
    range: [90, 100],
  },
  {
    participationRate: '80 - 89.99',
    bonusAllocation: 5.56,
    range: [80, 89.99],
  },
  {
    participationRate: '70 - 79.99',
    bonusAllocation: 6.25,
    range: [70, 79.99],
  },
  {
    participationRate: '60 - 69.99',
    bonusAllocation: 7.14,
    range: [60, 69.99],
  },
  {
    participationRate: '50 - 59.99',
    bonusAllocation: 8.33,
    range: [50, 59.99],
  },
  {
    participationRate: '40 - 49.99',
    bonusAllocation: 10,
    range: [40, 49.99],
  },
  {
    participationRate: '30 - 39.99',
    bonusAllocation: 12.5,
    range: [30, 39.99],
  },
  {
    participationRate: '20 - 29.99',
    bonusAllocation: 16.67,
    range: [20, 29.99],
  },
  {
    participationRate: '10 - 19.99',
    bonusAllocation: 25,
    range: [10, 19.99],
  },
  {
    participationRate: '0 - 9.99',
    bonusAllocation: 50,
    range: [0, 9.99],
  },
]
