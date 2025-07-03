import { Box, Typography, Grid, Container } from "@mui/material";
import React from "react";
import CircleWithTypo from "../../../../components/CircleWithTypo/CircleWithTypo";
import { aboutus } from "../../../../constants/about-us";

const About: React.FC = () => {
  return (
    <Box pt={10} pb={10} bgcolor="#18191d">
      <Container maxWidth="lg">
        <Grid container>
          <Grid item md={5} xs={12} sx={{ order: { xs: 2 } }}>
            {aboutus.map((item, index) => (
              <Grid
                key={`key-${index}`}
                container
                flexDirection="column"
                alignItems={
                  index === 0 || index === 2 ? "flex-start" : "flex-end"
                }
                my={index === 1 ? 1 : 0}
                sx={{ width: "100%" }}
              >
                <Grid
                  item
                  md={7}
                  xs={12}
                  display="flex"
                  justifyContent="center"
                  sx={{ width: "100%" }}
                >
                  <CircleWithTypo
                    content={item.title}
                    icon={item.icon}
                    secondVariant
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid
            item
            md={7}
            xs={12}
            display="flex"
            justifyContent="center"
            flexDirection="column"
            sx={{ order: { sm: 1, md: 2 }, pl: 3 }}
          >
            <Typography
              variant="h4"
              textAlign="right"
              sx={{ textAlign: { xs: "center", sm: "right" } }}
            >
              Unowocześnienie procesu wykańczania mieszkania
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                marginTop: 2,
                textAlign: { xs: "center", sm: "right" },
                mb: { xs: 3, sm: 0 },
              }}
              textAlign="right"
            >
              Nasz zespół wykorzystuje nowoczesne techniki cyfryzacji schematów
              budowlanych co ma przełożenie na zaplanowanie wykończenia
              nieruchomości w fazie wstępnej bez potrzeby organizacji spotkania.
              Zadaniem przedsięwzięcia jest przygotowanie mieszkania lub domu
              pod zagospodarowanie go stolarką meblową.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
