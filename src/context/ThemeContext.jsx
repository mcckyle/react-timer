//File name: ThemeContext.jsx
//Author: Kyle McColgan
//Date: 31 July 2026
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
  return window.matchMedia(DARK_MEDIA_QUERY).matches
  ? THEMES.DARK
  : THEMES.LIGHT;
}

function getInitialTheme()
{
  if (typeof window === "undefined")
  {
    return {
      theme: THEMES.LIGHT,
      manual: false
    };
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if ((savedTheme === THEMES.LIGHT) || (savedTheme === THEMES.DARK))
  {
    return {
      theme: savedTheme,
      manual: true
    };
  }

  return {
    theme: getSystemTheme(),
    manual: false
  };
}

function applyTheme(theme)
{
  const root = document.documentElement;

  if (root.dataset.theme !== theme)
  {
    root.dataset.theme = theme;
  }
  if (root.style.colorScheme !== theme)
  {
    root.style.colorScheme = theme;
  }
}

function saveTheme(theme)
{
  try
  {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  catch
  {
    //Storage unavailable.
  }
}

export function ThemeProvider({ children })
{
  const initialThemeState = useMemo(() => getInitialTheme(), []);
  const hasManualTheme = useRef(initialThemeState.manual);
  const [theme, setTheme] = useState(initialThemeState.theme);

  //Sync Theme to DOM.
  useLayoutEffect(() =>
  {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() =>
  {
    setTheme(current =>
    {
      const next =
      current === THEMES.DARK
      ? THEMES.LIGHT
      : THEMES.DARK;

      hasManualTheme.current = true;
      saveTheme(next);
      return next;
    });
  }, []);

  //Sync With System Theme Until Manual Override Exists.
  useEffect(() =>
  {
    const media = window.matchMedia(DARK_MEDIA_QUERY);

    function handleSystemTheme(event)
    {
      if (hasManualTheme.current)
      {
        return;
      }
      setTheme(event.matches ? THEMES.DARK : THEMES.LIGHT);
    }

    //Gracefully support older browsers.
    if (media.addEventListener)
    {
      media.addEventListener("change", handleSystemTheme);

      return () => media.removeEventListener("change", handleSystemTheme);
    }

    media.addListener(handleSystemTheme);

    return () => media.removeListener(handleSystemTheme);
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [
    theme,
    toggleTheme
  ]);

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
