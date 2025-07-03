import { Typography } from "@mui/material";
import React from "react";
import Carousel from "react-material-ui-carousel";
import building1 from "../../../../assets/images/building1.jpg";
import building2 from "../../../../assets/images/building2.jpg";
import { ImageItem, ImageOverlay } from "./ImageSlider.styled";

const ImageSlider: React.FC = () => {
  var items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      image: building1,
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      image: building2,
    },
  ];

  return (
    <Carousel stopAutoPlayOnHover={false} indicators={false}>
      {items.map((item, i) => (
        <>
          <ImageItem sx={{ backgroundImage: `url(${item.image})` }} />
          <ImageOverlay>
            <Typography
              variant="h2"
              textAlign="center"
              sx={{ textShadow: "4px 4px 6px rgba(66, 68, 90, 1)" }}
            >
              Remont Twojego mieszkania/domu <br />
              rozpoczyna się już teraz
            </Typography>
            <Typography
              variant="h4"
              textAlign="center"
              sx={{ textShadow: "4px 4px 6px rgba(66, 68, 90, 1)" }}
              mt={4}
            >
              Umów się na bezpłatną wizję lokalną
            </Typography>
          </ImageOverlay>
        </>
      ))}
    </Carousel>
  );
};

export default ImageSlider;
