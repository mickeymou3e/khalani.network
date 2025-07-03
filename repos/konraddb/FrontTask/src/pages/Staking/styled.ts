import { Paper, styled } from "@mui/material";

export const StakingContainer = styled(Paper)(
  () => `
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    min-width: 500px;
  `
);
