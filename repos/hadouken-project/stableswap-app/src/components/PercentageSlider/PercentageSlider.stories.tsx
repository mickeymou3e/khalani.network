import React, { ComponentProps, useState } from 'react'

import { Story } from '@storybook/react/types-6-0'

import PercentageSlider from './PercentageSlider.component'

export default {
  title: 'Components/PercentageSlider',
  description: '',
  component: PercentageSlider,
}

const Template: Story<ComponentProps<typeof PercentageSlider>> = () => {
  const [amount, setAmount] = useState(20)

  const onValueChange = (amount: React.SetStateAction<number>) => {
    setAmount(amount)
  }
  return <PercentageSlider value={amount} onChange={onValueChange} />
}

export const Basic = Template.bind({})
