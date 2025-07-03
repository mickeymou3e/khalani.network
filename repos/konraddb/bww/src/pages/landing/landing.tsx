import { Container } from "@mui/material";
import React from "react";
import Benefits from "./sections/Benefits/Benefits";
import ImageSlider from "./sections/ImageSlider/ImageSlider";
import Elastic from "./sections/Elastic/Elastic";
import About from "./sections/About/About";

const Landing: React.FC = () => {
  return (
    <>
      <ImageSlider />
      <Benefits />
      <Elastic />
      <About />
    </>
  );
};

export default Landing;
