import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { IFinishes, IStep2Props } from "../finish.types";
import { MuiFileInput } from "mui-file-input";

const Step2: React.FC<IStep2Props> = (props) => {
  const {
    flatArea,
    setFlatArea,
    roomsNumber,
    setRoomsNumber,
    bathArea,
    setBathArea,
    finish,
    setFinish,
    validate,
    finishes,
    files,
    setFiles,
  } = props;

  const [validateFinish, setValidateFinish] = useState<boolean>(false);

  // const handleFinishChange = (value: string): void => {
  //   const finishArr = finish;
  //   if (finishArr.includes(value)) {
  //     const index = finishArr.indexOf(value);
  //     finishArr.splice(index, 1);
  //   } else {
  //     finishArr.push(value);
  //   }
  //   setValidateFinish(finishArr.length === 0);
  //   setFinish(finishArr);
  // };

  const handleFinishChange = (value: number): void => {
    const cloned: IFinishes[] = JSON.parse(JSON.stringify(finish));
    const founded = cloned.find((finish) => finish.id === value);
    if (!founded) return;
    founded.checked = !founded.checked;
    console.log(finish);

    setFinish(cloned);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 5, md: 10 },
      }}
    >
      <Grid
        container
        sx={{ justifyContent: { xs: "center", md: "space-between" } }}
        gap={2}
      >
        <Grid item md={4}>
          <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              gap={2}
            >
              <Typography>
                Wpisz podstawowe informacje opisujące Twoje mieszkanie
              </Typography>
              <TextField
                id="outlined-basic"
                label="Powierzchnia mieszkania"
                variant="outlined"
                type="number"
                value={flatArea}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFlatArea(event.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">m2</InputAdornment>
                  ),
                }}
                helperText={!flatArea && validate ? "Uzupełnij pole" : ""}
                error={!flatArea && validate}
              />
              <TextField
                id="outlined-basic"
                label="Ilość pomieszczeń w mieszkaniu"
                variant="outlined"
                type="number"
                value={roomsNumber}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setRoomsNumber(event.target.value);
                }}
                helperText={!roomsNumber && validate ? "Uzupełnij pole" : ""}
                error={!roomsNumber && validate}
              />
              <TextField
                id="outlined-basic"
                label="Powierzchnia łazieńki"
                variant="outlined"
                type="number"
                value={bathArea}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setBathArea(event.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">m2</InputAdornment>
                  ),
                }}
                helperText={!bathArea && validate ? "Uzupełnij pole" : ""}
                error={!bathArea && validate}
              />
              <MuiFileInput
                value={files}
                onChange={(value) => setFiles(value)}
                multiple
                inputProps={{ accept: ".pdf,.png', .jpeg" }}
                variant="outlined"
                label="Załącz projekt"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid md={7}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography>
              Zaznacz składowe wykończenia, które chciałbyś żeby zostały
              wykonane
            </Typography>
            <Grid container mt={3}>
              {finish.map((item) => (
                <Grid
                  item
                  xs={6}
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  key={item.id}
                  sx={{ mb: 1.5 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={item.value}
                        checked={item.checked}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          handleFinishChange(item.id);
                        }}
                      />
                    }
                    label={item.label}
                  />
                </Grid>
              ))}
            </Grid>
            {validateFinish && validate && (
              <FormHelperText id="component-error-text" error sx={{ mt: 1 }}>
                Nie zaznaczono składowych wykończenia
              </FormHelperText>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2;
