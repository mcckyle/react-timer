//File name: PastTimers.jsx
//Author: Kyle McColgan
//Date: 9 February 2026
//Description: This file contains the past timers component for the React timer project.

import { formatDuration } from "../../utils/formatDuration";
import "./PastTimers.css";

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

export default function PastTimers({ timers, onClear })
{
  return (
    <aside className="past-timers" aria-label="Completed timers">

     {timers.length > 0 && (
       <header className="past-timers-header">
         <span className="past-timers-title">Completed</span>
         <button
           className="past-timers-clear"
           onClick={onClear}
           aria-label="Clear completed timers"
         >
           Clear
         </button>
       </header>
      )}

      <ul className="past-timers-list">
        {timers.length === 0 ? (
            <li className="past-timer-empty">
              No completed timers yet
            </li>
        ) : (
          timers.map((timer, i) => (
            <li key={i} className="past-timer-item">
              <span className="past-timer-duration">
                {formatDuration(timer.duration)}
              </span>
              <span className="past-timer-time">
                {formatTime(timer.completedAt)}
              </span>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
