//File name: main.jsx
//Author: Kyle McColgan
//Date: 22 May 2026
//Description: This file contains the main entry point component for the React timer project.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ThemeWrapper from "./components/ThemeWrapper.jsx";
import App from "./App.jsx";

import "./index.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ThemeWrapper>
        <App />
      </ ThemeWrapper>
    </ ThemeProvider>
  </StrictMode>,
);
