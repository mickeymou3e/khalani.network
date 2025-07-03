import React, { ComponentProps } from 'react'

import Switch from '@components/switch/Switch'
import { Box, Typography } from '@mui/material'
import { StoryObj } from '@storybook/react'

import Button from './Button'
import RadioButton from './RadioButton'

export default {
  title: 'Components/Buttons',
  description: '',
  component: Button,
}

type Story = StoryObj<ComponentProps<typeof Button>>

const Template: Story = {
  render: (args) => (
    <Box bgcolor="background.default" p={2}>
      <Box display="flex">
        <Typography sx={{ display: 'flex' }} variant="h4Bold">
          Buttons Contained
        </Typography>
        <Box display="flex" m={2}>
          <Box marginX={2}>
            <Box pt={2}>
              <Typography variant="h5">Disabled Large</Typography>
              <Button {...args} variant="contained" disabled size="large" />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Disabled Medium</Typography>
              <Button {...args} variant="contained" disabled />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Disabled Small</Typography>
              <Button {...args} variant="contained" disabled size="small" />
            </Box>
            <Box pt={2}>
              <Typography variant="h5">Disabled Tiny</Typography>
              <Button {...args} variant="contained" disabled size="tiny" />
            </Box>
          </Box>
          <Box marginX={2}>
            <Box pt={2}>
              <Typography variant="h5">Large</Typography>
              <Button
                {...args}
                tabIndex={0}
                autoFocus={true}
                variant="contained"
                size="large"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Medium</Typography>
              <Button {...args} variant="contained" />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Small</Typography>
              <Button {...args} variant="contained" size="small" />
            </Box>
            <Box pt={2}>
              <Typography variant="h5">Tiny</Typography>
              <Button {...args} variant="contained" size="tiny" />
            </Box>
          </Box>
        </Box>

        <Typography sx={{ display: 'flex' }} variant="h4Bold">
          Buttons Contained Secondary
        </Typography>
        <Box display="flex" m={2}>
          <Box marginX={2}>
            <Box pt={2}>
              <Typography variant="h5">Disabled Large</Typography>
              <Button
                {...args}
                variant="contained"
                color="secondary"
                disabled
                size="large"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Disabled Medium</Typography>
              <Button
                {...args}
                variant="contained"
                color="secondary"
                disabled
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Disabled Small</Typography>
              <Button
                {...args}
                color="secondary"
                variant="contained"
                disabled
                size="small"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Disabled Tiny</Typography>
              <Button
                {...args}
                color="secondary"
                variant="contained"
                disabled
                size="tiny"
              />
            </Box>
          </Box>
          <Box marginX={2}>
            <Box pt={2}>
              <Typography variant="h5">Large</Typography>
              <Button
                {...args}
                tabIndex={0}
                autoFocus={true}
                variant="contained"
                color="secondary"
                size="large"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Medium</Typography>
              <Button
                {...args}
                variant="contained"
                color="secondary"
                size="medium"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Small</Typography>
              <Button
                {...args}
                variant="contained"
                color="secondary"
                size="small"
              />
            </Box>
            <Box pt={2}>
              <Typography variant="h5">Tiny</Typography>
              <Button
                {...args}
                variant="contained"
                color="secondary"
                size="tiny"
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex">
        <Typography variant="h4Bold">Buttons Outlined</Typography>
        <Box display="flex" m={2}>
          <Box marginX={2}>
            <Box pt={2}>
              <Typography variant="h5">Disabled Large</Typography>
              <Button {...args} variant="outlined" disabled size="large" />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Disabled Medium</Typography>
              <Button {...args} variant="outlined" disabled />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Disabled Small</Typography>
              <Button {...args} variant="outlined" disabled size="small" />
            </Box>
            <Box pt={2}>
              <Typography variant="h5">Disabled Tiny</Typography>
              <Button {...args} variant="outlined" disabled size="tiny" />
            </Box>
          </Box>
          <Box marginX={2}>
            <Box pt={2}>
              <Typography variant="h5">Large</Typography>
              <Button
                {...args}
                tabIndex={0}
                autoFocus={true}
                variant="outlined"
                size="large"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Medium</Typography>
              <Button {...args} variant="outlined" />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Small</Typography>
              <Button {...args} variant="outlined" size="small" />
            </Box>
            <Box pt={2}>
              <Typography variant="h5">Tiny</Typography>
              <Button {...args} variant="outlined" size="tiny" />
            </Box>
          </Box>
        </Box>

        <Typography variant="h4Bold">Buttons Outlined Secondary</Typography>
        <Box display="flex" m={2}>
          <Box marginX={2}>
            <Box pt={2}>
              <Typography variant="h5">Disabled Large</Typography>
              <Button
                {...args}
                variant="outlined"
                color="secondary"
                disabled
                size="large"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Disabled Medium</Typography>
              <Button {...args} variant="outlined" color="secondary" disabled />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Disabled Small</Typography>
              <Button
                {...args}
                variant="outlined"
                color="secondary"
                disabled
                size="small"
              />
            </Box>
            <Box pt={2}>
              <Typography variant="h5">Disabled Tiny</Typography>
              <Button
                {...args}
                variant="outlined"
                color="secondary"
                disabled
                size="tiny"
              />
            </Box>
          </Box>
          <Box marginX={2}>
            <Box pt={2}>
              <Typography variant="h5">Large</Typography>
              <Button
                {...args}
                tabIndex={0}
                autoFocus={true}
                variant="outlined"
                color="secondary"
                size="large"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Medium</Typography>
              <Button
                {...args}
                variant="outlined"
                color="secondary"
                size="medium"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Small</Typography>
              <Button
                {...args}
                variant="outlined"
                color="secondary"
                size="small"
              />
            </Box>

            <Box pt={2}>
              <Typography variant="h5">Tiny</Typography>
              <Button
                {...args}
                variant="outlined"
                color="secondary"
                size="tiny"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box>
        <Typography variant="h4Bold">Radio buttons</Typography>
        <Box display="flex" m={2}>
          <Box marginX={2}>
            <Typography variant="h5">disabled</Typography>
            <RadioButton value="value" label="Radio button" disabled />
          </Box>

          <Box marginX={2}>
            <Typography variant="h5">disable checked</Typography>
            <RadioButton value="value" label="Radio button" disabled checked />
          </Box>

          <Box marginX={2}>
            <Typography variant="h5">normal</Typography>
            <RadioButton value="value" label="Radio button" checked={false} />
          </Box>

          <Box marginX={2}>
            <Typography variant="h5">checked</Typography>
            <RadioButton value="value" label="Radio button" checked />
          </Box>
        </Box>
      </Box>

      <Box pt={1}>
        <Typography variant="h4Bold">Switch button</Typography>
        <Box display="flex" m={2}>
          <Box marginX={2}>
            <Switch />
          </Box>
        </Box>
      </Box>

      <Box pt={1}>
        <Typography variant="h4Bold">Switch button disabled</Typography>
        <Box display="flex" m={2}>
          <Box marginX={2}>
            <Switch disabled />
          </Box>
        </Box>
      </Box>
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  text: 'Withdraw',
  isFetching: false,
}
