import { Box, Typography, Grid, Container } from "@mui/material";
import React from "react";
import CircleWithTypo from "../../../../components/CircleWithTypo/CircleWithTypo";
import { elasticFinishing } from "../../../../constants/elastic-finishing";

const Elastic: React.FC = () => {
  return (
    <Box pt={10} bgcolor="#18191d">
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            md={7}
            xs={12}
            display="flex"
            justifyContent="center"
            flexDirection="column"
            sx={{ pr: { xs: 0, sm: 5 } }}
          >
            <Typography
              variant="h4"
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              Swoboda i elastyczność w przeprowadzaniu wymarzonego wykończenia
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ marginTop: 2, textAlign: { xs: "center", sm: "left" } }}
            >
              Wykończone mieszkanie spełnieniające wymagania techniczne oraz
              walory estetyczne
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                marginTop: 2,
                textAlign: { xs: "center", sm: "left" },
                mb: { xs: 3, sm: 0 },
              }}
            >
              Realizujemy małe metraże
            </Typography>
          </Grid>
          <Grid item md={5} xs={12}>
            {elasticFinishing.map((elastic, index) => (
              <Grid
                key={`key-${index}`}
                container
                flexDirection="column"
                alignItems={
                  index === 0 || index === 2 ? "flex-start" : "flex-end"
                }
                my={index === 1 ? 1 : 0}
              >
                <Grid
                  item
                  md={7}
                  xs={12}
                  display="flex"
                  justifyContent="center"
                >
                  <CircleWithTypo
                    content={elastic.content}
                    icon={elastic.icon}
                    secondVariant
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Elastic;
