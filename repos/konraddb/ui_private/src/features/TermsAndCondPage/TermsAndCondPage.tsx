import { Trans } from "next-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button, Checkbox } from "@/components/atoms";

import {
  langButtonsWrapper,
  mainWrapperStyles,
  textWrapperStyles,
  typographyStyles,
} from "./TermsAndCondPage.styles";
import { Language, useTermsAndCondPage } from "./useTermsAndCondPage";

const TermsAndCondPage = () => {
  const {
    mainViewTitle,
    mainViewContent1,

    checkboxText,
    accept,
    cancel,
    neutralCopyrights,

    english,
    german,
    termsOfService,
    date,

    generalProvisions,
    generalProvisionsContent1,
    generalProvisionsContent2,
    generalProvisionsContent3,

    definitions,
    definitionsContent1,
    definitionsContent2,
    definitionsContent3,
    definitionsContent4,
    definitionsContent5,
    definitionsContent6,
    definitionsContent7,
    definitionsContent8,
    definitionsContent9,
    definitionsContent10,
    definitionsContent11,
    definitionsContent12,
    definitionsContent13,
    definitionsContent14,
    definitionsContent15,

    conclusionOfContract,
    conclusionOfContractContent1,
    conclusionOfContractContent2,
    conclusionOfContractContent3,

    servicesOfDlt,
    servicesOfDltContent1,
    servicesOfDltContent2,
    servicesOfDltContent3,
    servicesOfDltContent4,
    servicesOfDltContent5,

    clientObligations,
    clientObligationsContent1,
    clientObligationsContent2,
    clientObligationsContent3,

    placingOfOrders,
    placingOfOrdersContent1,
    placingOfOrdersContent2,

    costPaymentSettlement,
    costPaymentSettlementContent1,
    costPaymentSettlementContent2,
    costPaymentSettlementContent3,

    custodyWithDltc,
    custodyWithDltcContent1,
    custodyWithDltcContent2,
    custodyWithDltcContent3,

    liabilityProvisions,
    liabilityProvisionsContent1,
    liabilityProvisionsContent2,
    liabilityProvisionsContent3,
    liabilityProvisionsContent4,

    durationTermination,
    durationTerminationContent1,
    durationTerminationContent2,
    durationTerminationContent3,
    durationTerminationContent4,

    privacyStatement,
    privacyStatementContent1,

    rightOfRevocation,
    rightOfRevocationContent1,
    rightOfRevocationContent2,

    communication,
    communicationContent1,

    changesToTheseTradingTerms,
    changesToTheseTradingTermsContent1,
    changesToTheseTradingTermsContent2,
    changesToTheseTradingTermsContent3,
    changesToTheseTradingTermsContent4,
    changesToTheseTradingTermsContent5,

    applicableLawAndJurisdiction,
    applicableLawAndJurisdictionContent1,
    applicableLawAndJurisdictionContent2,

    finalProvisions,
    finalProvisionsContent1,
    finalProvisionsContent2,
    finalProvisionsContent3,
    finalProvisionsContent4,

    userCode,
    language,
    checkboxTrue,
    setCheckboxTrue,
    changeLanguage,
    primaryButtonAction,
    secondaryButtonAction,
  } = useTermsAndCondPage();

  if (!userCode) {
    return null;
  }

  return (
    <Box sx={mainWrapperStyles}>
      <Typography component="h5" variant="h5" align="center" mb={2}>
        {mainViewTitle}
      </Typography>
      <Typography
        variant="subtitle"
        align="center"
        color="primary.gray2"
        mb={9}
      >
        {mainViewContent1}
      </Typography>

      <Box sx={langButtonsWrapper}>
        <Button
          variant={language === Language.English ? "translucent" : "text"}
          onClick={() => changeLanguage(Language.English)}
          fullWidth
        >
          {english}
        </Button>
        <Button
          variant={language === Language.German ? "translucent" : "text"}
          onClick={() => changeLanguage(Language.German)}
          fullWidth
        >
          {german}
        </Button>
      </Box>

      <Typography variant="subtitle" align="center" mb={2} fontWeight="bold">
        {termsOfService}
      </Typography>
      <Typography align="center" color="primary.gray2" mb={4}>
        {date}
      </Typography>

      <Box sx={textWrapperStyles}>
        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{generalProvisions}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{generalProvisionsContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{generalProvisionsContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{generalProvisionsContent3}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{definitions}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent3}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent4}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent5}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent6}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent7}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent8}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent9}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent10}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent11}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent12}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent13}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent14}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{definitionsContent15}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{conclusionOfContract}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{conclusionOfContractContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{conclusionOfContractContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{conclusionOfContractContent3}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{servicesOfDlt}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{servicesOfDltContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{servicesOfDltContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{servicesOfDltContent3}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{servicesOfDltContent4}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{servicesOfDltContent5}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{clientObligations}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2">
          <Trans>{clientObligationsContent1[0]}</Trans>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              <Trans>{clientObligationsContent1[1]}</Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <Trans>{clientObligationsContent1[2]}</Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2" mb={2}>
              <Trans>{clientObligationsContent1[3]}</Trans>
            </Typography>
          </li>
        </ul>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{clientObligationsContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{clientObligationsContent3}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{placingOfOrders}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{placingOfOrdersContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{placingOfOrdersContent2}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{costPaymentSettlement}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{costPaymentSettlementContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{costPaymentSettlementContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{costPaymentSettlementContent3}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{custodyWithDltc}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{custodyWithDltcContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2">
          <Trans>{custodyWithDltcContent2[0]}</Trans>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              <Trans>{custodyWithDltcContent2[1]}</Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <Trans>{custodyWithDltcContent2[2]}</Trans>
            </Typography>
          </li>
        </ul>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{custodyWithDltcContent2[3]}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{custodyWithDltcContent3}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{liabilityProvisions}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2">
          <Trans>{liabilityProvisionsContent1[0]}</Trans>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              <Trans>{liabilityProvisionsContent1[1]}</Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2" mb={2}>
              <Trans>{liabilityProvisionsContent1[2]}</Trans>
            </Typography>
          </li>
        </ul>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{liabilityProvisionsContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{liabilityProvisionsContent3}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{liabilityProvisionsContent4}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{durationTermination}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{durationTerminationContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{durationTerminationContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{durationTerminationContent3}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{durationTerminationContent4}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{privacyStatement}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{privacyStatementContent1}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{rightOfRevocation}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{rightOfRevocationContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{rightOfRevocationContent2}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{communication}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{communicationContent1}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{changesToTheseTradingTerms}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{changesToTheseTradingTermsContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{changesToTheseTradingTermsContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2">
          <Trans>{changesToTheseTradingTermsContent3[0]}</Trans>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              <Trans>{changesToTheseTradingTermsContent3[1]}</Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <Trans>{changesToTheseTradingTermsContent3[2]}</Trans>
            </Typography>
          </li>
        </ul>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{changesToTheseTradingTermsContent3[3]}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2">
          <Trans>{changesToTheseTradingTermsContent4[0]}</Trans>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              <Trans>{changesToTheseTradingTermsContent4[1]}</Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2" mb={2}>
              <Trans>{changesToTheseTradingTermsContent4[2]}</Trans>
            </Typography>
          </li>
        </ul>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{changesToTheseTradingTermsContent5}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{applicableLawAndJurisdiction}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{applicableLawAndJurisdictionContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{applicableLawAndJurisdictionContent2}</Trans>
        </Typography>

        <Typography sx={typographyStyles} fontWeight="bold" mb={2}>
          <Trans>{finalProvisions}</Trans>
        </Typography>

        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{finalProvisionsContent1}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{finalProvisionsContent2}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{finalProvisionsContent3}</Trans>
        </Typography>
        <Typography sx={typographyStyles} variant="body2" mb={2}>
          <Trans>{finalProvisionsContent4}</Trans>
        </Typography>
      </Box>

      <Checkbox
        id="eAudit"
        label={checkboxText}
        value={checkboxTrue}
        onChange={() => setCheckboxTrue(!checkboxTrue)}
      />

      <Box width="100%" my={6}>
        <Button
          onClick={primaryButtonAction}
          variant="contained"
          size="large"
          fullWidth
          disabled={!checkboxTrue}
        >
          {accept}
        </Button>

        <Button
          onClick={secondaryButtonAction}
          variant="text"
          size="large"
          fullWidth
          sx={{ marginTop: 4 }}
        >
          {cancel}
        </Button>
      </Box>

      <Typography variant="body2">
        <Trans>{neutralCopyrights}</Trans>
      </Typography>
    </Box>
  );
};

export default TermsAndCondPage;
