import * as React from "react";
import { Autocomplete, Box, Paper, TextField } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Moment } from "moment";
import { IStep1Props } from "../finish.types";

interface AcOption {
  city: string;
  voivodeship: string;
}

const options: AcOption[] = [
  { city: "Nowy Sącz", voivodeship: "Małopolskie" },
  { city: "Kraków", voivodeship: "Małopolskie" },
  { city: "Brzesko", voivodeship: "Małopolskie" },
  { city: "Bochnia", voivodeship: "Małopolskie" },
  { city: "Zakopane", voivodeship: "Małopolskie" },
  { city: "Nowy Targ", voivodeship: "Małopolskie" },
  { city: "Katowice", voivodeship: "Małopolskie" },
  { city: "Rzeszów", voivodeship: "Małopolskie" },
];

const Step1: React.FC<IStep1Props> = (props) => {
  const { city, setCity, date, setDate, validate } = props;

  const handleChange = (newValue: Moment | null) => {
    setDate(newValue);
  };

  const handleCityChange = (newValue: string | null) => {
    setCity(newValue);
  };

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Autocomplete
          freeSolo
          options={options.map((option) => option.city)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Miejscowość inwestycji"
              placeholder="Wpisz lub wybierz z listy"
              helperText={!city && validate ? "Uzupełnij pole" : ""}
              error={!city && validate}
            />
          )}
          value={city}
          onChange={(event, value) => handleCityChange(value)}
        />
        <Box display="flex" flexDirection="column" gap={2}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              openTo="day"
              value={date}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
      </Box>
    </Paper>
  );
};

export default Step1;
