//File name: PastTimers.jsx
//Author: Kyle McColgan
//Date: 13 March 2026
//Description: This file contains the past timers component for the timer React project.

import { formatDuration, formatTime, toValidDate } from "../../utils/formatDuration";
import "./PastTimers.css";

export default function PastTimers({ timers, onClear })
{
  const hasTimers = timers.length > 0;

  return (
    <aside
      className="past-timers"
      aria-label="Completed timers"
      aria-live="polite"
    >
     {hasTimers && (
       <header className="past-timers-header">
         <h2 className="past-timers-title">Completed</h2>
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
        {!hasTimers ? (
          <li className="past-timer-empty">
            No completed timers yet
          </li>
        ) : (
          timers.map((timer, index) => {
            const completedDate = toValidDate(timer.completedAt);

            return (
              <li key={timer.completedAt ?? index} className="past-timer-item">
                <span className="past-timer-duration">
                  {formatDuration(timer.duration)}
                </span>

                {completedDate && (
                  <time
                    className="past-timer-time"
                    dateTime={completedDate.toISOString()}
                  >
                    {formatTime(completedDate)}
                  </time>
                )}
              </li>
            );
        })
      )}
      </ul>
    </aside>
  );
}
