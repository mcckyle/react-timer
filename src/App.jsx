//File name: App.jsx
//Author: Kyle McColgan
//Date: 19 March 2026
//Description: This file contains the App component for the timer React project.

import Timer from "./components/Timer/Timer.jsx";
import "./App.css";

function App()
{
  return (
    <main className="app" aria-label="Timer application">
      <Timer/>
    </main>
  );
}

export default App;
