import { styled, TableContainer } from '@mui/material'

export const CustomizedTable = styled(TableContainer)(
  () => `
    .MuiTable-root {
      border-collapse: separate;
      border-spacing: 0 3px;
      padding: 16px;
    }
    .MuiTableHead-root .MuiTableCell-root {
      border: none;
      padding: 0 0 19px 8px;
    }
    .MuiTableBody-root {
      .MuiTableCell-root {
        border: none;
        padding: 0;
      }
      .MuiTableRow-root:nth-of-type(even) {
        border-radius: 8px;
        background: #222335;
      }
    }
  `,
)
