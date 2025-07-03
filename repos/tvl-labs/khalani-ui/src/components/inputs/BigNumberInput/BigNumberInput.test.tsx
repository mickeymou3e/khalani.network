import React, { useState } from 'react'

import Button from '@components/buttons/Button'
import '@testing-library/jest-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'

import BigNumberInput from './BigNumberInput.component'

interface InputProps {
  decimals: number
  initialValue?: bigint
}

function BigNumberInputContainer({
  decimals,
  initialValue = BigInt(10000000),
}: InputProps) {
  const [amount, setAmount] = useState<bigint>(initialValue)

  const onValueChange = (value: bigint) => {
    setAmount(value)
  }

  return (
    <>
      <BigNumberInput
        value={amount}
        decimals={decimals}
        onChange={onValueChange}
      />
      <Button data-testid="away" text="testButton" onClick={() => null} />
    </>
  )
}

describe('BigNumberInput component', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern')
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('displays initial value correctly', async () => {
    await render(<BigNumberInputContainer decimals={3} />)
    const input = screen.getByRole('textbox')
    expect(input?.closest('input')?.value).toEqual('10000')
  })
  it('displays correct value', async () => {
    await render(<BigNumberInputContainer decimals={3} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '23.000' } })
    expect(input?.closest('input')?.value).toEqual('23.000')
  })
  it('does not displays incorrect value', async () => {
    await render(<BigNumberInputContainer decimals={3} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '23.0as' } })
    expect(input?.closest('input')?.value).toEqual('10000')
  })
  it('does not displays value with more decimals', async () => {
    await render(<BigNumberInputContainer decimals={3} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '23.0110' } })
    expect(input?.closest('input')?.value).toEqual('10000')
  })
  it('does not format input while still typing', async () => {
    await render(<BigNumberInputContainer decimals={3} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '23.0' } })
    expect(input?.closest('input')?.value).toEqual('23.0')
  })
  it('does format input when click away', async () => {
    await render(<BigNumberInputContainer decimals={3} />)

    jest.runAllTimers()

    const input = screen.getByRole('textbox')

    await fireEvent.change(input, { target: { value: '23.123' } })

    const button = await screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() =>
      expect(input?.closest('input')?.value).toEqual('23.12300'),
    )
  })
  it('does format input when click away and deletes trailing zeroes', async () => {
    await render(<BigNumberInputContainer decimals={3} />)

    jest.runAllTimers()

    const input = screen.getByRole('textbox')

    await fireEvent.change(input, { target: { value: '23.000' } })

    const button = await screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => expect(input?.closest('input')?.value).toEqual('23'))
  })
  it('empty input case', async () => {
    await render(<BigNumberInputContainer decimals={3} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '' } })
    expect(input?.closest('input')?.value).toEqual('')
  })
  it('null input case', async () => {
    await render(<BigNumberInputContainer decimals={3} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: null } })
    expect(input?.closest('input')?.value).toEqual('')
  })
  it('zero input case', async () => {
    await render(<BigNumberInputContainer decimals={3} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '0.000' } })
    expect(input?.closest('input')?.value).toEqual('0.000')
  })
  it('does not change empty field value on focus out', async () => {
    await render(<BigNumberInputContainer decimals={3} />)

    jest.runAllTimers()

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '' } })

    const button = await screen.getByRole('button')

    fireEvent.click(button)

    await waitFor(() => expect(input?.closest('input')?.value).toEqual(''))
  })
})
