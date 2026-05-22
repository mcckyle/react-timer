//File name: App.jsx
//Author: Kyle McColgan
//Date: 22 May 2026
//Description: This file contains the App component for the timer React project.

import Timer from "./components/Timer/Timer.jsx";
import { useTheme } from "./context/ThemeContext.jsx";

import "./components/theme.css";
import "./App.css";

function App()
{
  const { onToggleTheme } = useTheme();
  return (
    <div className="app-shell">
      <main className="app" aria-label="Ambient Timer">
        <Timer onToggleTheme={onToggleTheme} />
      </main>
    </div>
  );
}

export default App;
