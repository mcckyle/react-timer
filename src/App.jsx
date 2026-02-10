//File name: App.jsx
//Author: Kyle McColgan
//Date: 9 February 2026
//Description: This file contains the App component for the React timer project.

import Timer from "./components/Timer/Timer.jsx";
import "./App.css";

function App()
{
  return (
    <main className="app" role="main">
      <Timer/>
    </main>
  );
}

export default App;
