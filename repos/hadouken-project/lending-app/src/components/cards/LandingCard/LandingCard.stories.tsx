import React, { ComponentProps } from 'react'

import { BigNumber } from 'ethers'

import {
  BigNumberWithTooltip,
  CkbIcon,
  convertBigNumberToDecimal,
} from '@hadouken-project/ui'
import { Story } from '@storybook/react/types-6-0'
import { bigNumberPercentage, createIconCell } from '@utils/table'

import LandingCard from './LandingCard.component'

export default {
  title: 'Components/Cards/LandingCard',
  description: '',
  component: LandingCard,
}

const Template: Story<ComponentProps<typeof LandingCard>> = (args) => (
  <LandingCard {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  row: {
    id: 'CKB',
    cells: {
      assets: {
        value: createIconCell(
          <CkbIcon style={{ height: 24, width: 24 }} />,
          'CKB',
        ),
        sortingValue: 'CKB',
      },
      market: {
        value: (
          <BigNumberWithTooltip
            value={BigNumber.from(5400000000)}
            decimals={1}
          />
        ),
        sortingValue: convertBigNumberToDecimal(BigNumber.from(5400000000), 1),
      },
      borrowed: {
        value: (
          <BigNumberWithTooltip value={BigNumber.from(66757200)} decimals={1} />
        ),
        sortingValue: convertBigNumberToDecimal(BigNumber.from(66757200), 1),
      },
      apy: {
        value: bigNumberPercentage(BigNumber.from(600), 4),
      },
      variableBorrow: {
        value: bigNumberPercentage(BigNumber.from(810), 4),
      },
      // TODO-HDK-652 bring back stable borrow
      // stableBorrow: {
      //   value: bigNumberPercentage(BigNumber.from(810), 4),
      // },
    },
  },
}
