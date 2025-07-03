import { BigNumber } from 'ethers'

import { tokens } from '@tests/tokens'

import {
  addSlippageToValue,
  sortTokensByAddressOrder,
  subtractSlippageFromValue,
} from '.'

describe('Utils', () => {
  it('addSlippageToValue', () => {
    expect(addSlippageToValue(BigNumber.from(100), 1)).toEqual(
      BigNumber.from(101),
    )

    expect(addSlippageToValue(BigNumber.from(100), 0)).toEqual(
      BigNumber.from(100),
    )

    expect(addSlippageToValue(BigNumber.from(10000000), 0.001)).toEqual(
      BigNumber.from(10000000),
    )

    expect(addSlippageToValue(BigNumber.from(1), 1)).toEqual(BigNumber.from(1))
  })

  it('subtractSlippageFromValue', () => {
    expect(subtractSlippageFromValue(BigNumber.from(100), 1)).toEqual(
      BigNumber.from(99),
    )

    expect(subtractSlippageFromValue(BigNumber.from(1), 1)).toEqual(
      BigNumber.from(0),
    )
  })

  describe('sortTokensByAddressOrder', () => {
    it('is in good place', () => {
      expect(
        sortTokensByAddressOrder([tokens[0].address, tokens[1].address])(
          tokens[0],
          tokens[1],
        ),
      ).toEqual(-1)
    })
    it('it is the same token', () => {
      expect(
        sortTokensByAddressOrder([tokens[1].address, tokens[0].address])(
          tokens[0],
          tokens[0],
        ),
      ).toEqual(0)
    })
  })
})
