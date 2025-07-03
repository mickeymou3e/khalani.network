import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Container, Grid, Paper, TextField } from "@mui/material";
import { useContactForm } from "./contact.hooks";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { v4 as uuidv4 } from "uuid";

const Contact: React.FC = () => {
  const {
    name,
    setName,
    surname,
    setSurname,
    email,
    setEmail,
    phone,
    setPhone,
    content,
    setContent,
    validate,
    setValidate,
  } = useContactForm();

  const send = () => {
    setValidate(true);
    setDoc(doc(db, "contacts", uuidv4()), {
      name,
      surname,
      email,
      phone,
      content,
    });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: { xs: "calc(100vh - 148px)", md: "calc(100vh - 188px)" },
      }}
    >
      <Box sx={{ width: "100%", mt: { xs: 3, md: 8 } }}>
        <Typography variant="h5" textAlign="center" sx={{ mb: 3 }}>
          Skontaktuj się z nami !
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label="Imię"
                variant="outlined"
                fullWidth
                onChange={(event) => setName(event.target.value)}
                helperText={!name && validate ? "Uzupełnij pole" : ""}
                error={!name && validate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label="Nazwisko"
                variant="outlined"
                fullWidth
                onChange={(event) => setSurname(event.target.value)}
                helperText={!surname && validate ? "Uzupełnij pole" : ""}
                error={!surname && validate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label="E-mail"
                variant="outlined"
                fullWidth
                onChange={(event) => setEmail(event.target.value)}
                helperText={!email && validate ? "Uzupełnij pole" : ""}
                error={!email && validate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label="Numer telefonu"
                variant="outlined"
                fullWidth
                onChange={(event) => setPhone(event.target.value)}
                helperText={!phone && validate ? "Uzupełnij pole" : ""}
                error={!phone && validate}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-multiline-flexible"
                label="Treść wiadomości"
                multiline
                rows={4}
                fullWidth
                onChange={(event) => setContent(event.target.value)}
                helperText={!content && validate ? "Uzupełnij pole" : ""}
                error={!content && validate}
              />
            </Grid>
          </Grid>
        </Paper>
        <Button
          variant="contained"
          onClick={send}
          sx={{ mt: 3, float: "right" }}
          size="large"
        >
          Wyślij
        </Button>
      </Box>
    </Container>
  );
};

export default Contact;
