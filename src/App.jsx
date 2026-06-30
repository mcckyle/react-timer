//File name: App.jsx
//Author: Kyle McColgan
//Date: 29 June 2026
//Description: This file contains the App component for the timer React project.

import Timer from "./components/Timer/Timer.jsx";
import { useTheme } from "./context/ThemeContext.jsx";

import "./components/theme.css";
import "./App.css";

function App()
{
  const { toggleTheme } = useTheme();

  return (
    <main className="app-shell">
      <Timer toggleTheme={toggleTheme} />
    </main>
  );
}

export default App;
