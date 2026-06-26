//File name: App.jsx
//Author: Kyle McColgan
//Date: 25 June 2026
//Description: This file contains the App component for the timer React project.

import Timer from "./components/Timer/Timer.jsx";
import { useTheme } from "./context/ThemeContext.jsx";

import "./components/theme.css";
import "./App.css";

function App()
{
  const { toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <Timer toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
