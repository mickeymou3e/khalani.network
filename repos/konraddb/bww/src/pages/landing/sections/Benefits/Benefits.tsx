import { Box, Container, Typography } from "@mui/material";
import React from "react";
import CircleWithTypo from "../../../../components/CircleWithTypo/CircleWithTypo";
import { benefits } from "../../../../constants/benefits";

const Benefits: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box pt={5} pb={10}>
        <Typography variant="h3" textAlign="center">
          Korzyści wynikające ze współpracy
        </Typography>
        <Box
          display="flex"
          justifyContent="space-evenly"
          pb={5}
          flexWrap="wrap"
          rowGap={3}
          mt={5}
        >
          {benefits.map((benefit) => (
            <Box
              key={benefit.id}
              display="flex"
              justifyContent="center"
              sx={{ flexBasis: { xs: "100%", sm: "33%" } }}
            >
              <CircleWithTypo
                icon={benefit.icon}
                title={benefit.title}
                content={benefit.content}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Benefits;
