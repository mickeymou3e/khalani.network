import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import { ToggleGroup } from './index'

describe('ToggleGroup component', () => {
  const toggles = [
    {
      id: '1',
      name: 'name1',
    },
    {
      id: '2',
      name: 'name2',
    },
    {
      id: '3',
      name: 'name3',
    },
    {
      id: '4',
      name: 'name4',
    },
  ]

  it('display correctly messages', () => {
    render(<ToggleGroup toggles={toggles} selected="1" />)

    expect(screen.getByText('name1')).toBeInTheDocument()
    expect(screen.getByText('name2')).toBeInTheDocument()
    expect(screen.getByText('name3')).toBeInTheDocument()
    expect(screen.getByText('name4')).toBeInTheDocument()
  })

  it('change state after clicking button', async () => {
    let buttonId = ''

    const onToggleChange = (value: string) => {
      buttonId = value
    }

    await render(
      <ToggleGroup
        toggles={toggles}
        onToggleChange={onToggleChange}
        selected="1"
      />,
    )

    const button3 = await screen.getByText('name3')
    const button2 = await screen.getByText('name2')

    await fireEvent.click(button2)
    expect(buttonId).toBe('2')
    await fireEvent.click(button3)
    expect(buttonId).toBe('3')
  })

  it('dont change state after repeating clicking same button', async () => {
    let buttonId = ''

    const onToggleChange = (value: string) => {
      buttonId = value
    }

    await render(
      <ToggleGroup
        toggles={toggles}
        onToggleChange={onToggleChange}
        selected="1"
      />,
    )

    const button2 = await screen.getByText('name2')

    await fireEvent.click(button2)
    expect(buttonId).toBe('2')
    await fireEvent.click(button2)
    expect(buttonId).toBe('2')
  })
})
