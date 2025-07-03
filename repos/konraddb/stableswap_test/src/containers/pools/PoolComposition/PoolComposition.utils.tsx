import React from 'react'

import config from '@config'
import { getTokenIconComponent, IconStackView } from '@hadouken-project/ui'
import { GENERIC_POOL_SYMBOL } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import {
  CompositionBlock,
  CompositionType,
  IPoolModel,
} from '@store/pool/selectors/models/types'

export const tokenIconCompositionRenderer = (
  compositionBlock: CompositionBlock,
): React.ReactNode => {
  const onClick = (id: string) => {
    const win = window.open(
      `${config.explorerUrl.godwoken}/address/${id}`,
      '_blank',
    )
    win?.focus()
  }

  if (compositionBlock.type === CompositionType.TOKEN) {
    const token = compositionBlock.value as IToken

    const TokenIcon = getTokenIconComponent(token.symbol)
    return (
      <IconStackView
        mainIcon={{
          icon: <TokenIcon width={32} height={32} />,
          id: token.address,
          text: token.symbol,
        }}
        onClick={onClick}
        icons={[]}
      />
    )
  } else if (compositionBlock.type === CompositionType.POOL) {
    const pool = compositionBlock.value as IPoolModel

    const nestedCompositionsBlocks = pool.compositionBlocks.map(
      (block) => block.value.id,
    )
    const ParentIcon = getTokenIconComponent(GENERIC_POOL_SYMBOL)
    return (
      <IconStackView
        mainIcon={{
          icon: <ParentIcon width={40} height={40} />,
          id: pool.address,
          text: pool.pool.name,
        }}
        icons={pool.tokens.map(({ symbol, name, address }) => {
          const ChildIcon = getTokenIconComponent(
            nestedCompositionsBlocks.includes(address)
              ? symbol
              : GENERIC_POOL_SYMBOL,
          )
          return {
            icon: <ChildIcon width={32} height={32} />,
            id: address,
            text: name,
          }
        })}
        onClick={onClick}
      />
    )
  }

  return null
}
