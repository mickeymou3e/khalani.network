import { Box } from "@mui/material";

import { CompletedView } from "./CompletedView";
import { MainView } from "./MainView";
import { containerStyle } from "./RegisterPage.styles";
import { TwoFaView } from "./TwoFaView";
import { RegisterViews, useRegisterPage } from "./useRegisterPage";

export type RegisterPageProps = {
  view?: RegisterViews;
};

const RegisterPage = (props: RegisterPageProps) => {
  const { view, formik, handleShowInitialScreen, handleNextView } =
    useRegisterPage(props);

  return (
    <Box sx={containerStyle}>
      {view === RegisterViews.Main && (
        <MainView formik={formik} onNextView={handleNextView} />
      )}
      {view === RegisterViews.TwoFA && (
        <TwoFaView formik={formik} onBack={handleShowInitialScreen} />
      )}
      {view === RegisterViews.Completed && <CompletedView />}
    </Box>
  );
};

export default RegisterPage;
