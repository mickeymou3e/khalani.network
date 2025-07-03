import * as React from "react";
import { Box, Container } from "@mui/material";
import ImageGallery from "react-image-gallery";
import { images } from "./gallery.constants";

const Gallery: React.FC = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: { xs: "calc(100vh - 148px)", md: "calc(100vh - 188px)" },
      }}
    >
      <Box sx={{ width: "100%", mt: { xs: 3, md: 4 } }}>
        <ImageGallery items={images} />
      </Box>
    </Container>
  );
};

export default Gallery;
