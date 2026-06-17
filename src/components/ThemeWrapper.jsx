//File name: ThemeWrapper.jsx
//Author: Kyle McColgan
//Date: 16 June 2026
//Description: This file contains the Mantine UI/UX component for the timer React project.

import React, { useMemo } from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { useTheme } from "../context/ThemeContext";

const ThemeWrapper = ({ children }) =>
{
    const { theme } = useTheme(); //"light" || "dark".
    const mantineTheme = useMemo(() =>
    {
      return createTheme({
        focusRing: "never",
        respectReducedMotion: true,
        defaultRadius: 0,

        fontFamily: "var(--font-sans)",
        fontFamilyMonospace: "var(--font-mono)",
        headings: { fontFamily: "var(--font-sans)", fontWeight: "700" },
      });
    }, []);

    return (
      <MantineProvider theme={mantineTheme} forceColorScheme={theme}>
        {children}
      </MantineProvider>
    );
};

export default ThemeWrapper;
