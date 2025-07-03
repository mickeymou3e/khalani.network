import React from 'react'

import { getChainConfig } from '@config'
import {
  ExternalLink,
  getAddressLabel,
  IColumn,
  IRow,
} from '@hadouken-project/ui'
import { alpha, Box, Tooltip, Typography } from '@mui/material'

import { messages } from './PoolDetails.messages'
import { IPoolDetailsProps } from './PoolDetails.types'

export const poolDetailsColumn: IColumn[] = [
  {
    name: 'attribute',
    value: 'Attribute',
    width: '30%',
  },

  {
    name: 'details',
    value: 'Details',
    width: '70%',
  },
]

export const createPoolDetailsRows = (
  props: IPoolDetailsProps,
  chainId: string,
): IRow[] => {
  return [
    {
      id: 'name',
      cells: {
        attribute: {
          value: messages.POOL_NAME,
        },
        details: {
          value: props.name,
        },
      },
    },

    {
      id: 'symbol',
      cells: {
        attribute: {
          value: messages.POOL_SYMBOL,
        },
        details: {
          value: props.symbol,
        },
      },
    },

    {
      id: 'type',
      cells: {
        attribute: {
          value: messages.POOL_TYPE,
        },
        details: {
          value: props.type?.toString() ?? '',
        },
      },
    },

    {
      id: 'fees',
      cells: {
        attribute: {
          value: messages.SWAP_FEES,
        },
        details: {
          value: (
            <Box display="flex">
              <Tooltip title={props.fee.stringValue}>
                <Typography variant="paragraphSmall" color="textSecondary">
                  {props.fee.toNumber() >= 0.01
                    ? props.fee.toFixed(2)
                    : props.fee.toFixed(3)}
                  %
                </Typography>
              </Tooltip>

              <Typography
                sx={{
                  ml: 1,
                  color: (theme) => alpha(theme.palette.common.white, 0.3),
                }}
                variant="paragraphSmall"
              >
                {`(${messages.SWAP_FEES_ANNOTATION})`}
              </Typography>
            </Box>
          ),
        },
      },
    },

    {
      id: 'manager',
      cells: {
        attribute: {
          value: messages.POOL_MANAGER,
        },
        details: {
          value: messages.NONE, // TODO find pool manager
        },
      },
    },

    {
      id: 'owner',
      cells: {
        attribute: {
          value: messages.POOL_OWNER,
        },
        details: {
          value: (
            <Box display="flex">
              <Typography>{getAddressLabel(props.owner)}</Typography>
              <Box ml={0.5}>
                <ExternalLink
                  height={14}
                  width={16}
                  destination={getChainConfig(chainId).explorerUrl.godwoken}
                  hash={props.owner ?? ''}
                  type="address"
                />
              </Box>
            </Box>
          ),
        },
      },
    },

    {
      id: 'contract',
      cells: {
        attribute: {
          value: messages.CONTRACT_ADDRESS,
        },
        details: {
          value: (
            <Box display="flex">
              <Typography>{getAddressLabel(props.address)}</Typography>
              <Box ml={0.5}>
                <ExternalLink
                  height={14}
                  width={16}
                  destination={getChainConfig(chainId).explorerUrl.godwoken}
                  hash={props.address}
                  type="address"
                />
              </Box>
            </Box>
          ),
        },
      },
    },

    {
      id: 'creation',
      cells: {
        attribute: {
          value: messages.CREATION_DATE,
        },
        details: {
          value: props.creationDate?.toDateString() ?? '',
        },
      },
    },
    ...(props.amp
      ? [
          {
            id: 'amp',
            cells: {
              attribute: {
                value: messages.AMP,
              },
              details: {
                value: props.amp,
              },
            },
          },
        ]
      : []),
  ]
}
