import axios from 'axios'

import { Network } from '@constants/Networks'
import { BigDecimal } from '@utils/math'

import { fetchParticipation } from './fetchParticipation.saga'

describe('fetchParticipation', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should return participation in 2 decimals', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: '4083' }))

    const participation = await fetchParticipation(Network.GodwokenTestnet)

    expect(participation).toEqual(BigDecimal.from('4083', 2))
  })

  it('should return participation as 0 call fails', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject())

    const participation = await fetchParticipation(Network.GodwokenTestnet)

    expect(participation).toEqual(BigDecimal.from(0, 2))
  })
})
