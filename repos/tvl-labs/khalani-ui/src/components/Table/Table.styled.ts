import { styled, TableContainer } from '@mui/material'

export const CustomizedTable = styled(TableContainer)(
  ({ theme }) => `
    .tabs-container {
      border-bottom: 1px solid ${theme.palette.elevation.light};
    }
    .MuiTable-root {
      border-collapse: separate;
      border-spacing: 0 3px;
      border-top: 1px solid ${theme.palette.elevation.light};
    }
    .MuiTableHead-root .MuiTableCell-root {
      border-bottom: 1px solid ${theme.palette.elevation.light};
      padding: 16px 0;
    }
    .MuiTableBody-root {
      .MuiTableCell-root {
        border: none;
        padding: 0;
        border-bottom: 1px solid ${theme.palette.elevation.light};
      }
    }
  `,
)
