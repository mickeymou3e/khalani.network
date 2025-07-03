import { ThemeProvider } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Footer from "./layouts/Footer/Footer";
import Header from "./layouts/Header/Header";
import { Social } from "./layouts/Social/Social";
import theme from "./layouts/theme";
import Contact from "./pages/contact/contact";
import Finish from "./pages/finish/finish";
import Gallery from "./pages/gallery/gallery";
import Landing from "./pages/landing/landing";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/finish" element={<Finish />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <Social />
      </div>
    </ThemeProvider>
  );
}

export default App;
