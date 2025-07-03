import React from "react";
import "./App.css";
import { ThemeProvider } from "./styles/theme";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <h1>Hello from frontend</h1>
      </div>
    </ThemeProvider>
  );
}

export default App;
