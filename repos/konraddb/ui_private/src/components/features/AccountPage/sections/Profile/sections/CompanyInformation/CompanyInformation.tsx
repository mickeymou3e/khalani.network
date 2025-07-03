import { Box, Stack, Typography } from "@mui/material";

import { Asset } from "@/components/molecules";
import { grayTextWrapperStyles } from "@/components/molecules/BackdropsMolecules/GrayTextWrapper";

import {
  ListChildrenType,
  useCompanyInformation,
} from "./useCompanyInformation";

const CompanyInformation = () => {
  const {
    companyInformationLabel,
    informationList,
    tradingFeeLabel,
    alphaLaunchRewardLabel,
    tradingFeeValue,
  } = useCompanyInformation();

  return (
    <Box>
      <Typography
        variant="button"
        sx={{
          textTransform: "uppercase",
        }}
        mb={6}
      >
        {companyInformationLabel}
      </Typography>

      <Box mb={2} height={360} sx={grayTextWrapperStyles}>
        {informationList.map((item, index) => (
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            key={`element-${item.label}`}
            mb={index === informationList.length - 1 ? 0 : 1}
          >
            <Typography variant="body2">{item.label}</Typography>

            {item.component === ListChildrenType.currency ? (
              <Asset
                asset={{
                  icon: item.value,
                  label: item.value,
                }}
                iconSize={20}
                LabelProps={{
                  variant: "body2",
                  fontWeight: 700,
                }}
              />
            ) : (
              <Typography variant="body2" fontWeight={700}>
                {item.value}
              </Typography>
            )}
          </Stack>
        ))}
      </Box>

      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
        height={100}
        sx={grayTextWrapperStyles}
      >
        <Box>
          <Typography variant="body2">{tradingFeeLabel}</Typography>
          <Typography variant="body3" color="primary.gray3">
            {alphaLaunchRewardLabel}
          </Typography>
        </Box>
        <Typography variant="body2" fontWeight={700}>
          {tradingFeeValue}%
        </Typography>
      </Stack>
    </Box>
  );
};

export default CompanyInformation;
