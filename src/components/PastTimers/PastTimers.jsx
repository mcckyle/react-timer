//File name: PastTimers.jsx
//Author: Kyle McColgan
//Date: 4 May 2026
//Description: This file contains the past timers component for the timer React project.

import { formatDuration, formatTime, toValidDate } from "../../utils/formatDuration";
import "./PastTimers.css";

export default function PastTimers({ timers, onClear })
{
  const hasTimers = timers.length > 0;

  return (
    <aside className="past-timers" aria-label="Completed timers">
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

      <ul
        className="past-timers-list"
        aria-live="polite"
        aria-relevant="additions"
      >
        {!hasTimers ? (
          <li className="past-timers-empty">
            No completed timers yet
          </li>
        ) : (
          timers.map((timer, index) => {
            const completedDate = toValidDate(timer.completedAt);

            return (
              <li
                key={timer.completedAt ?? `${timer.duration}-${index}`}
                className="past-timers-item"
              >
                <span className="past-timers-duration">
                  {formatDuration(timer.duration)}
                </span>

                {completedDate && (
                  <time
                    className="past-timers-time"
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
