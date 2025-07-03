import React from 'react'

import { Typography, useTheme } from '@mui/material'
import Box from '@mui/material/Box'

import { ArrowTopRightIcon } from '../icons/business/ArrowTopRight'
import { IIconStackViewProps } from './IconStackView.types'

const IconStackView: React.FC<IIconStackViewProps> = ({
  mainIcon,
  icons,
  onClick,
}) => {
  const theme = useTheme()
  return (
    <Box>
      <Box pb={1} display="flex" alignItems="center">
        {mainIcon.icon}
        <Typography sx={{ ml: 1 }} variant="paragraphSmall">
          {mainIcon.text}
        </Typography>
        <Box
          sx={{ cursor: 'pointer' }}
          onClick={() => onClick?.(mainIcon.id)}
          display="flex"
          alignItems="start"
          ml={0.5}
        >
          <ArrowTopRightIcon
            style={{
              width: 12,
              height: 12,
              fill: theme.palette.text.secondary,
            }}
          />
        </Box>
      </Box>

      {icons.map((item, index) => {
        return (
          <Box key={item.id} display="flex">
            <Box>
              <Box
                ml={2}
                height={30}
                width={20}
                borderLeft={(theme) =>
                  `1px solid ${theme.palette.text.secondary}`
                }
                borderBottom={(theme) =>
                  `1px solid ${theme.palette.text.secondary}`
                }
              ></Box>
              <Box
                ml={2}
                height={item.subIcons ? 140 : 30}
                borderLeft={(theme) =>
                  index + 1 === icons.length
                    ? 'none'
                    : `1px solid ${theme.palette.text.secondary}`
                }
              />
            </Box>

            <Box>
              <Box mt={1.5} ml={2} display="flex" alignItems="center">
                <Box>{item.icon}</Box>
                <Typography sx={{ ml: 1 }} variant="paragraphSmall">
                  {item.text}
                </Typography>
                <Box
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onClick?.(item.id)}
                  display="flex"
                  alignItems="start"
                  ml={0.5}
                >
                  <ArrowTopRightIcon
                    style={{
                      width: 12,
                      height: 12,
                      fill: theme.palette.text.secondary,
                    }}
                  />
                </Box>
              </Box>
              {item.subIcons &&
                item.subIcons.map((item, index) => (
                  <Box display="flex" key={item.id}>
                    <Box>
                      <Box
                        ml={4}
                        height={35}
                        width={20}
                        borderLeft={(theme) =>
                          `1px solid ${theme.palette.text.secondary}`
                        }
                        borderBottom={(theme) =>
                          `1px solid ${theme.palette.text.secondary}`
                        }
                      />
                      <Box
                        ml={4}
                        height={25}
                        borderLeft={(theme) =>
                          index + 1 === icons.length
                            ? 'none'
                            : `1px solid ${theme.palette.text.secondary}`
                        }
                      />
                    </Box>
                    <Box ml={2} display="flex" mt={2} alignItems="center">
                      <Box>{item.icon}</Box>

                      <Typography
                        ml={1}
                        variant="paragraphSmall"
                        whiteSpace="nowrap"
                        mb={0.5}
                      >
                        {item.text}
                      </Typography>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={() => onClick?.(item.id)}
                        display="flex"
                        alignItems="start"
                        ml={0.5}
                        mb={0.5}
                      >
                        <ArrowTopRightIcon
                          style={{
                            width: 12,
                            height: 12,
                            fill: theme.palette.text.secondary,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default IconStackView
