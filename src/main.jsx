//File name: main.jsx
//Author: Kyle McColgan
//Date: 11 November 2026
//Description: This file contains the main entry point component for the React timer project.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import App from "./App.jsx";

import "./components/theme.css";
import "./index.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ ThemeProvider>
  </StrictMode>,
);
