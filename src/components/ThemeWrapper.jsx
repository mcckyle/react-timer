//File name: ThemeWrapper.jsx
//Author: Kyle McColgan
//Date: 25 June 2026
//Description: This file contains the Mantine UI/UX component for the timer React project.

import React from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { useTheme } from "../context/ThemeContext";

const mantineTheme = createTheme({
  focusRing: "never",
  respectReducedMotion: true,
  defaultRadius: 0,

  fontFamily: "var(--font-sans)",
  fontFamilyMonospace: "var(--font-mono)",
  headings: { fontFamily: "var(--font-sans)", fontWeight: "700" },
});

const ThemeWrapper = ({ children }) =>
{
    const { theme } = useTheme(); //"light" || "dark".

    return (
      <MantineProvider theme={mantineTheme} forceColorScheme={theme}>
        {children}
      </MantineProvider>
    );
};

export default ThemeWrapper;
