import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import { Alert, Container, Snackbar } from "@mui/material";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/steps3";
import { useFinishForm } from "./finish.hooks";
import { v4 as uuidv4 } from "uuid";

const steps = [
  "Wybierz date remontu",
  "Wybierz szczegóły remontu",
  "Przewidywane koszty",
];

const Finish: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const [successOpen, setSuccessOpen] = React.useState(false);
  const [costs, setCosts] = React.useState<number | undefined>();

  const {
    city,
    setCity,
    date,
    setDate,
    flatArea,
    setFlatArea,
    roomsNumber,
    setRoomsNumber,
    bathArea,
    setBathArea,
    finish,
    setFinish,
    phone,
    setPhone,
    email,
    setEmail,
    validate,
    setValidate,
    finishes,
    files,
    setFiles,
  } = useFinishForm();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
    countCost();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
    if (step === 2) {
      countCost();
    }
  };

  const countCost = () => {
    let costs = 0;
    finish.map((item) => {
      if (item.value === "szpachlowanie" && item.checked && flatArea) {
        costs = costs + +flatArea * 2.4 * 40;
      }
      if (item.value === "malowanie" && item.checked && flatArea) {
        costs = costs + +flatArea * 2.4 * 40;
      }
      if (item.value === "układanie" && item.checked && flatArea) {
        costs = costs + +flatArea * 50;
      }
      if (item.value === "wykonanie" && item.checked && bathArea) {
        costs = costs + +bathArea * 2100;
      }
    });

    setCosts(costs);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const sendForm = () => {
    setValidate(true);
    if (
      !city ||
      !flatArea ||
      !roomsNumber ||
      !bathArea ||
      !finish ||
      !phone ||
      !email
    ) {
    }
    setDoc(doc(db, "rennovations", uuidv4()), {
      city,
      flatArea,
      roomsNumber,
      bathArea,
      finish,
      phone,
      email,
    });
    setSuccessOpen(true);
  };

  const handleSuccessClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessOpen(false);
  };

  const handleErrorClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessOpen(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: { xs: "calc(100vh - 148px)", md: "calc(100vh - 188px)" },
      }}
    >
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert
          onClose={handleSuccessClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Pomyślnie wysłano formularz
        </Alert>
      </Snackbar>
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Nie wszystkie pola zostały uzupełnione.
        </Alert>
      </Snackbar>
      <Box sx={{ width: "100%", mt: { xs: 3, md: 8 } }}>
        <Stepper
          nonLinear
          activeStep={activeStep}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 0 },
          }}
        >
          {steps.map((label, index) => (
            <Step
              key={label}
              completed={completed[index]}
              disabled={
                (activeStep === 0 && (!city || !date)) ||
                (activeStep === 1 &&
                  (!flatArea ||
                    !roomsNumber ||
                    !bathArea ||
                    !finish ||
                    finishes.length === 0 ||
                    files?.length === 0))
              }
            >
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          <Box mt={5} display="flex" justifyContent="center">
            {activeStep === 0 && (
              <Step1
                city={city}
                setCity={setCity}
                date={date}
                setDate={setDate}
                validate={validate}
              />
            )}

            {activeStep === 1 && (
              <Step2
                flatArea={flatArea}
                setFlatArea={setFlatArea}
                roomsNumber={roomsNumber}
                setRoomsNumber={setRoomsNumber}
                bathArea={bathArea}
                setBathArea={setBathArea}
                finish={finish}
                setFinish={setFinish}
                validate={validate}
                finishes={finishes}
                files={files}
                setFiles={setFiles}
              />
            )}

            {activeStep === 2 && (
              <Step3
                onClick={sendForm}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                validate={validate}
                costs={costs}
                finishes={finish}
              />
            )}
          </Box>

          <>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Wróć
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Dalej
              </Button>
              {/* <Button onClick={handleComplete}>Zatwierdź</Button> */}
            </Box>
          </>
        </div>
      </Box>
    </Container>
  );
};

export default Finish;
