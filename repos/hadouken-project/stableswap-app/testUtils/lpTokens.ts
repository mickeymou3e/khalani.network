import { IToken } from '@interfaces/token'

export const pool3: IToken = {
  id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
  address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
  name: '3pool',
  decimals: 6,
  symbol: '3pool',
  displayName: '3pool',
}

export const lpTokensReducerMock = {
  ids: [pool3.address],
  entities: {
    [pool3.address]: pool3,
  },
}
