import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { ResultContainer } from "./styled";

interface ResultProps {
  yearlyReward: number;
  apy: number;
  setShowData: (isShowData: boolean) => void;
}

export const Result: React.FC<ResultProps> = (props) => {
  const { yearlyReward, apy, setShowData } = props;

  return (
    <>
      <ResultContainer component="span">
        <Box display="flex" justifyContent="space-between">
          <Typography textAlign="center" color="text.secondary">
            Yearly Rewards Paid:
          </Typography>
          <Typography textAlign="center" sx={{ marginLeft: 1 }}>
            {yearlyReward} USD
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography textAlign="center" color="text.secondary">
            APY:
          </Typography>
          <Typography textAlign="center" sx={{ marginLeft: 1 }}>
            {apy} %
          </Typography>
        </Box>
      </ResultContainer>
      <Button
        variant="contained"
        size="large"
        onClick={() => setShowData(false)}
      >
        Try another address
      </Button>
    </>
  );
};
