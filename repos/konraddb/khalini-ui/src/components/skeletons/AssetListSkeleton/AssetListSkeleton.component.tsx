import React from 'react'

import { Box, Skeleton } from '@mui/material'

import { IAssetListSkeletonProps } from './AssetListSkeleton.types'

const AssetListSkeleton: React.FC<IAssetListSkeletonProps> = ({
  rowsCount = 4,
  columnsCount = 4,
}) => {
  const rows = Array.from(Array(rowsCount).keys())
  const columns = Array.from(Array(columnsCount).keys())
  return (
    <Box>
      <Box display="flex" width="100%">
        {columns.map((index) => (
          <Box
            px={3}
            py={2}
            border={(theme) =>
              `1px solid ${theme.palette.background.backgroundBorder}`
            }
            borderLeft={(theme) =>
              index === 0
                ? 'none'
                : `1px solid ${theme.palette.background.backgroundBorder}`
            }
            borderRight={(theme) =>
              index === columns.length - 1
                ? 'none'
                : `1px solid ${theme.palette.background.backgroundBorder}`
            }
            key={index}
            width="100%"
          >
            <Skeleton height={24} width={112} />
          </Box>
        ))}
      </Box>

      {rows.map((index) => {
        return (
          <Box key={index} display="flex">
            {columns.map((index) => (
              <Box
                height={81}
                display="flex"
                px={3}
                py={2}
                border={(theme) =>
                  `1px solid ${theme.palette.background.backgroundBorder}`
                }
                borderLeft={(theme) =>
                  index === 0
                    ? 'none'
                    : `1px solid ${theme.palette.background.backgroundBorder}`
                }
                borderRight={(theme) =>
                  index === columns.length - 1
                    ? 'none'
                    : `1px solid ${theme.palette.background.backgroundBorder}`
                }
                key={index}
                width="100%"
              >
                {index === 0 ? (
                  <Box display="flex" alignItems="center">
                    <Skeleton width={40} height={40} variant="circular" />
                    <Box ml={2}>
                      <Skeleton height={24} width={112} />
                    </Box>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center">
                    <Skeleton height={24} width={112} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )
      })}
    </Box>
  )
}

export default AssetListSkeleton
