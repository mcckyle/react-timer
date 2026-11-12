//File name: App.jsx
//Author: Kyle McColgan
//Date: 11 November 2026
//Description: This file contains the App component for the timer React project.

import Timer from "./components/Timer/Timer.jsx";
import { useTheme } from "./context/ThemeContext.jsx";

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
