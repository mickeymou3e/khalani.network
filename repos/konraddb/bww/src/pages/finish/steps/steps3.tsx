import * as React from "react";
import { Box, Button, Paper, Typography, TextField } from "@mui/material";
import { IStep3Props } from "../finish.types";

const Step3: React.FC<IStep3Props> = (props) => {
  const {
    onClick,
    phone,
    setPhone,
    email,
    setEmail,
    validate,
    costs,
    finishes,
  } = props;

  const filteredFinishes = finishes.filter(
    (finish) => finish.additional && finish.checked
  );

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="subtitle1" textAlign="center">
          W podanym przewidywanym terminie jest możliwość <br /> przeprowadzenia
          wykończenia
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
          Przewidywane koszty wykonania robocizny, <br /> ceny materiałów i
          urządzeń do wyceny indywidualnej
        </Typography>
        <Typography variant="subtitle1" textAlign="center" sx={{ mt: 2 }}>
          {costs || "-"} zł
        </Typography>
        {filteredFinishes.length > 0 && (
          <>
            <Typography variant="subtitle1" textAlign="center" sx={{ my: 2 }}>
              Dodatkowo wycena indywidualna obejmuje:
            </Typography>
            {filteredFinishes.map((finish) => (
              <Typography variant="body2">- {finish.label}</Typography>
            ))}
          </>
        )}

        <Typography variant="subtitle1" textAlign="center" sx={{ my: 2 }}>
          Jeśli jesteś chętny poznać szczegółową ofertę zapraszamy do kontaktu
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={2}
          width="60%"
        >
          <TextField
            id="outlined-basic"
            label="Telefon"
            variant="outlined"
            type="number"
            value={phone}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPhone(event.target.value);
            }}
            helperText={!phone && validate ? "Uzupełnij pole" : ""}
            error={!phone && validate}
          />
          <TextField
            id="outlined-basic"
            label="Adres e-mail"
            variant="outlined"
            type="string"
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
            helperText={!email && validate ? "Uzupełnij pole" : ""}
            error={!email && validate}
          />
        </Box>
        <Button variant="contained" sx={{ mt: 3 }} onClick={onClick}>
          Wyślij formularz
        </Button>
      </Box>
    </Paper>
  );
};

export default Step3;
