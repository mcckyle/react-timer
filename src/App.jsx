//File name: App.jsx
//Author: Kyle McColgan
//Date: 16 February 2026
//Description: This file contains the App component for the React timer project.

import Timer from "./components/Timer/Timer.jsx";
import "./App.css";

function App()
{
  return (
    <main className="app">
      <div className="app-inner">
        <Timer/>
      </div>
    </main>
  );
}

export default App;
