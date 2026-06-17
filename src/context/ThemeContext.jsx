//File name: ThemeContext.jsx
//Author: Kyle McColgan
//Date: 16 June 2026
//Description: This file contains the theming context component for the timer React project.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";

const ThemeContext = createContext(undefined);
const THEME_STORAGE_KEY = "precision-timer-theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme()
{
  return window.matchMedia(DARK_MEDIA_QUERY).matches
  ? "dark"
  : "light";
}

function getInitialTheme()
{
  if (typeof window === "undefined")
  {
    return {
      theme: "light",
      manual: false
    };
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if ((savedTheme === "light") || (savedTheme === "dark"))
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
  root.dataset.theme = theme;
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
  const initial = useMemo(() => getInitialTheme(), []);
  const manualTheme = useRef(initial.manual);
  const [theme, setTheme] = useState(initial.theme);

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
        current === "dark"
        ? "light"
        : "dark";

      manualTheme.current = true;
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
      if (manualTheme.current)
      {
        return;
      }
      setTheme(event.matches ? "dark" : "light");
    }

    media.addEventListener?.("change", handleSystemTheme);

    return () =>
    {
      media.removeEventListener?.("change", handleSystemTheme);
    };
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
