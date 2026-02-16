//File name: PastTimers.jsx
//Author: Kyle McColgan
//Date: 14 February 2026
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
  const hasTimers = timers.length > 0;

  return (
    <aside className="past-timers" aria-label="Completed timers">

     {hasTimers && (
       <header className="past-timers-header">
         <span className="past-timers-title">Completed</span>
         <button
           type="button"
           className="past-timers-clear"
           onClick={onClear}
         >
           Clear
         </button>
       </header>
      )}

      <ul className="past-timers-list">
        { ! hasTimers ? (
            <li className="past-timer-empty">
              No completed timers yet
            </li>
        ) : (
          timers.map((timer, i) => (
            <li key={i} className="past-timer-item">
              <span className="past-timer-duration">
                {formatDuration(timer.duration)}
              </span>
              <time
                className="past-timer-time"
                dateTime={new Date(timer.completedAt).toISOString()}
              >
                {formatTime(timer.completedAt)}
              </time>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
