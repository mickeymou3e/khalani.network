import React from 'react'

import { getChainConfig } from '@config'
import {
  getTokenIconComponent,
  getTokenIconWithChainComponent,
  IconStackView,
} from '@hadouken-project/ui'
import { IPoolToken } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import {
  CompositionBlock,
  CompositionType,
  IPoolModel,
} from '@store/pool/selectors/models/types'

export const tokenIconCompositionRenderer = (
  compositionBlock: CompositionBlock,
  chainId: string,
): React.ReactNode => {
  const onClick = (id: string) => {
    const win = window.open(
      `${getChainConfig(chainId).explorerUrl.godwoken}/address/${id}`,
      '_blank',
    )
    win?.focus()
  }

  if (compositionBlock.type === CompositionType.TOKEN) {
    const token = compositionBlock.value as IToken

    const TokenIcon = getTokenIconWithChainComponent(
      token.symbol,
      token.source ?? '',
    )

    const tokenId = token.isLendingToken
      ? token.unwrappedAddress
      : token.address

    return (
      <IconStackView
        mainIcon={{
          icon: <TokenIcon width={40} height={40} />,
          id: tokenId ?? '',
          text: token.displayName,
        }}
        onClick={onClick}
        icons={[]}
      />
    )
  } else if (compositionBlock.type === CompositionType.POOL) {
    const poolModel = compositionBlock.value as IPoolModel

    const ParentIcon = getTokenIconComponent(
      poolModel.pool.symbol === 'HDK-Boosted-USD'
        ? 'HDK-B-2POOL'
        : poolModel.pool.symbol,
    )

    return (
      <IconStackView
        mainIcon={{
          icon: <ParentIcon width={40} height={40} />,
          id: poolModel.address,
          text: poolModel.pool.displayName ?? poolModel.pool.name,
        }}
        icons={poolModel.tokens.map(
          (
            {
              symbol,
              name,
              address,
              displayName,
              isLendingToken,
              unwrappedAddress,
            },
            index,
          ) => {
            const tokenDisplayName = poolModel.pool.tokens.find(
              (token) => token.address === address,
            )?.displayName
            const nestedPool = poolModel.compositionBlocks[index]
              .value as IPoolModel

            const subIcons =
              !nestedPool || !nestedPool.compositionBlocks
                ? undefined
                : nestedPool.compositionBlocks.map((block) => {
                    const token = block.value as IPoolToken

                    const Icon = getTokenIconWithChainComponent(
                      token.symbol,
                      token.source ?? '',
                    )

                    return {
                      icon: <Icon width={32} height={32} />,
                      id: token.address,
                      text: token.displayName ?? displayName ?? name,
                    }
                  })

            const ChildIcon = getTokenIconComponent(symbol)
            const tokenId = isLendingToken ? unwrappedAddress : address

            return {
              icon: <ChildIcon width={32} height={32} />,
              id: tokenId ?? '',
              text: tokenDisplayName ?? displayName,
              subIcons,
            }
          },
        )}
        onClick={onClick}
      />
    )
  }

  return null
}
