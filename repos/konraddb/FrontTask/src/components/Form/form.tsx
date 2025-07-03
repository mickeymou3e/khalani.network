import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Web3Utils from "web3-utils";

interface FormProps {
  getData: (userAddress: string) => void;
}

export const Form: React.FC<FormProps> = (props) => {
  const { getData } = props;

  const [userAddress, setUserAddress] = useState<string>("");
  const [invalidAddress, setInvalidAddress] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setUserAddress(inputValue);
    setInvalidAddress(!Web3Utils.isAddress(inputValue));
  };

  const handleSubmit = () => {
    if (!invalidAddress && userAddress !== "") {
      getData(userAddress);
    }
  };

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Ethereum address"
        variant="outlined"
        helperText={invalidAddress ? "Invalid ETH address" : ""}
        error={invalidAddress}
        onChange={handleInputChange}
      />
      <Box display="flex" flexDirection="column" alignItems="center">
        <InfoOutlinedIcon color="primary" />
        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ marginTop: 1 }}
        >
          Enter address and confirm to show data
        </Typography>
      </Box>

      <Button variant="contained" size="large" onClick={handleSubmit}>
        Show data
      </Button>
    </>
  );
};
