import axios from 'axios'

import { Network } from '@constants/Networks'
import { BigDecimal } from '@utils/math'

import { LockDropQueryResultData } from '../lockDrop.types'
import { fetchUserLocks } from './fetchUserLocks.saga'

const lockdropQueryData: LockDropQueryResultData = {
  list: [
    {
      id: '0x1',
      tokenAddress: '0x9904d25f1fd95a17fa90ad95901a9aede6952d85',
      timestamp: '1697799815',
      owner: '0x6529c8a2726b6adc91260e21fa380fa6d34af27f',
      lockId: '1',
      amount: '25000000000000000000',
      lockLength: 0,
      weight: '10000000000000000000',
      isLocked: true,
      transaction:
        '0x56a7109fb55e06e198f2d902bf045c5c27384750db05d366826812ee945434b2',
      isClaimed: true,
      lockInUSD: '21982084289435574400',
      reward: '94462999060026249308',
    },
  ],
  totalUserHdkToClaim: '1421',
  totalUserValueLocked: '724',
  totalValueLockedWeighted: '46271',
  totalHdkTokens: '300000',
}

describe('fetchUserLocks', () => {
  beforeEach(() => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: lockdropQueryData }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return array of locks and lockdrop details', async () => {
    const {
      lockdrops,
      totalUserHdkToClaim,
      totalUserValueLocked,
      totalHdkTokens,
    } = await fetchUserLocks(Network.GodwokenTestnet, '0x123')

    expect(lockdrops.length).toBe(1)

    expect(lockdrops[0].amount).toEqual(BigDecimal.from('25000000000000000000'))
    expect(lockdrops[0].reward).toEqual(BigDecimal.from('94462999060026249308'))

    expect(totalUserHdkToClaim).toEqual(BigDecimal.from('1421'))
    expect(totalUserValueLocked).toEqual(BigDecimal.from('724'))
    expect(totalHdkTokens).toEqual(BigDecimal.from('300000'))
  })

  it('should return lockdrop details when user is null', async () => {
    const {
      lockdrops,
      totalUserHdkToClaim,
      totalUserValueLocked,
      totalHdkTokens,
    } = await fetchUserLocks(Network.GodwokenTestnet, null)

    expect(lockdrops.length).toBe(0)

    expect(totalUserHdkToClaim).toEqual(BigDecimal.from(0))
    expect(totalUserValueLocked).toEqual(BigDecimal.from(0))
    expect(totalHdkTokens).toEqual(BigDecimal.from('300000'))
  })
})
