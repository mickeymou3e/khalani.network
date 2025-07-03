import React, { useState } from "react";

import FileUpload from "@/icons/FileUpload";
import { Box, Stack, useTheme, Typography, Button } from "@mui/material";
import { Legend, BarChart } from "@/components/Charts";

import {
  subpageContainerStyles,
  ContentWrapper,
  EmissionsContainer,
  EmissionsBox,
  ChartSectionContainer,
  LegendContainer,
  legendPlaceholderStyles,
} from "./styled";
import { DataGridWithControls } from "@/components/DataGridWithControls";
import Circle from "@/icons/Circle";
import { EmptyBarChartComponent } from "@/components/Charts/EmptyBarChart/EmptyBarChart";

const MeasureModule = () => {
  const theme = useTheme();
  const [isDataUploaded, setIsDataUploaded] = useState(false);

  const pieChartData = [
    { name: "Scope 1", value: 1, percentage: 1 },
    { name: "Scope 2", value: 10, percentage: 10 },
    { name: "Scope 3", value: 89, percentage: 89 },
  ];

  const barChartData = [
    { name: "Jul '23", scope1: 500, scope2: 650, scope3: 850 },
    { name: "Oct '23", scope1: 0, scope2: 800, scope3: 0 },
    { name: "Jan '24", scope1: 1000, scope2: 500, scope3: 0 },
    { name: "Apr '24", scope1: 1200, scope2: 0, scope3: 500 },
    { name: "Jul '24", scope1: 1200, scope2: 1300, scope3: 0 },
    { name: "Oct '24", scope1: 1350, scope2: 0, scope3: 0 },
  ];

  const netEmissionsValue = isDataUploaded ? "23,499" : "0,00";

  const handleUploadData = () => {
    setIsDataUploaded(true);
  };

  return (
    <Stack direction="row" flex={1} marginLeft={"250px"}>
      <Box sx={subpageContainerStyles}>
        <ContentWrapper
          spacing={10}
          alignItems="center"
          sx={{ paddingBottom: "3rem" }}
        >
          <EmissionsContainer sx={{ margin: "1rem 0" }}>
            <EmissionsBox>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                textAlign="center"
              >
                NET EMISSIONS
              </Typography>
              <Typography variant="h3" color="textPrimary">
                {netEmissionsValue}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                tCO₂e
              </Typography>
            </EmissionsBox>

            {!isDataUploaded ? (
              <ChartSectionContainer>
                <EmptyBarChartComponent />
                <Box sx={legendPlaceholderStyles}>
                  <Circle />
                  <Typography
                    variant="body2"
                    color="primary.gray1"
                    textAlign="center"
                  >
                    Upload or Connect Data to Reveal
                  </Typography>
                </Box>
              </ChartSectionContainer>
            ) : (
              <ChartSectionContainer>
                <BarChart dataProvider={barChartData} />
                <LegendContainer>
                  <Legend dataProvider={pieChartData} />
                </LegendContainer>
              </ChartSectionContainer>
            )}
          </EmissionsContainer>

          {!isDataUploaded && (
            <Box
              display="flex"
              justifyContent="center"
              width="100%"
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleUploadData}
                sx={{
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                Show data
              </Button>
            </Box>
          )}
        </ContentWrapper>

        <DataGridWithControls
          columnConfig={[{ key: "Rem", title: "Rem" }]}
          dataProvider={[]}
          datagridLabel="Net Emissions by Scope"
          emptyGridPlaceholder={"Upload or connect"}
          emptyGridPlaceholderIcon={
            <FileUpload
              width={72}
              height={72}
              fill={theme.palette.primary.main}
              fillOpacity={0.2}
            />
          }
          listLength={0}
          onPageSizeChange={() => console.log("page size change")}
          collapseHeader
        />
      </Box>
    </Stack>
  );
};

export default MeasureModule;
