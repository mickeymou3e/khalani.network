import React, { useState } from 'react'

import {
  Accordion as MUIAccordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
} from '@mui/material'

import { ArrowDownIcon } from '..'
import { IAccordionProps } from './Accordion.types'

const Accordion: React.FC<IAccordionProps> = (props) => {
  const { summary, details, isAlwaysExpanded } = props

  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <MUIAccordion
      expanded={isAlwaysExpanded || expanded}
      onChange={() => setExpanded(!expanded)}
      elevation={1}
      sx={{ py: 0.5 }}
      disableGutters
    >
      <AccordionSummary sx={{ p: 0 }} expandIcon={<ArrowDownIcon />}>
        {summary}
      </AccordionSummary>
      {expanded && <Divider sx={{ mb: 2 }} />}
      <AccordionDetails sx={{ p: 0 }}>{details}</AccordionDetails>
    </MUIAccordion>
  )
}

export default Accordion
