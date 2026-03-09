//File name: splitDuration.jsx
//Author: Kyle McColgan
//Date: 8 March 2026
//Description: This file contains a custom time unit converter built for the timer React project.

/* Convert ms -> h/m/s */
export function splitDuration(ms)
{
    const totalSeconds = Math.floor(ms / 1000);

    return {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
    };
}
