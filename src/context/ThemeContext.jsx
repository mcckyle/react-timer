//File name: ThemeContext.jsx
//Author: Kyle McColgan
//Date: 9 September 2026
//Description: This file contains the theming context component for the timer React project.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";

const ThemeContext = createContext(undefined);
const THEME_STORAGE_KEY = "timer-theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";
const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

function getSystemTheme()
{
  if (typeof window === "undefined")
  {
    return THEMES.DARK;
  }

  return window.matchMedia(DARK_MEDIA_QUERY).matches
  ? THEMES.DARK
  : THEMES.LIGHT;
}

function getInitialTheme()
{
  if (typeof window === "undefined")
  {
    return {
      theme: THEMES.DARK,
      manual: false
    };
  }

  try
  {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if ((savedTheme === THEMES.LIGHT) || (savedTheme === THEMES.DARK))
    {
      return {
        theme: savedTheme,
        manual: true
      };
    }
  }
  catch
  {
    //Local storage unavailable...
  }

  return {
    theme: getSystemTheme(),
    manual: false
  };
}

function applyTheme(theme)
{
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

function saveTheme(theme)
{
  try
  {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  catch
  {
    //Local storage unavailable...
  }
}

export function ThemeProvider({ children })
{
  const initialTheme = useMemo(() => getInitialTheme(), []);
  const [theme, setTheme] = useState(initialTheme.theme);
  const hasManualTheme = useRef(initialTheme.manual);

  //Keep document theme synchronized with React state.
  useLayoutEffect(() =>
  {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() =>
  {
    setTheme(currentTheme =>
    {
      const nextTheme =
      currentTheme === THEMES.DARK
      ? THEMES.LIGHT
      : THEMES.DARK;

      hasManualTheme.current = true;
      saveTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  //Follow the OS Theme until the user chooses manually.
  useEffect(() =>
  {
    if (hasManualTheme.current)
    {
      return;
    }

    const media = window.matchMedia(DARK_MEDIA_QUERY);

    const handleSystemTheme = event =>
    {
      if (hasManualTheme.current)
      {
        return;
      }
      setTheme(event.matches ? THEMES.DARK : THEMES.LIGHT);
    };

    //Gracefully support older browsers.
    if (media.addEventListener)
    {
      media.addEventListener("change", handleSystemTheme);

      return () => media.removeEventListener("change", handleSystemTheme);
    }

    media.addListener(handleSystemTheme);

    return () => media.removeListener(handleSystemTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme
    }), [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
    {children}
    </ThemeContext.Provider>
  );
};

export function useTheme()
{
  const context = useContext(ThemeContext);

  if (!context)
  {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return context;
}
