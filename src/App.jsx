//File name: App.jsx
//Author: Kyle McColgan
//Date: 15 May 2026
//Description: This file contains the App component for the timer React project.

import Timer from "./components/Timer/Timer.jsx";
import "./App.css";

function App()
{
  return (
    <div className="app-shell">
      <main className="app" aria-label="Ambient Timer">
        <Timer />
      </main>
    </div>
  );
}

export default App;
