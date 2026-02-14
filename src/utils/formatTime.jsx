//File name: formatTime.jsx
//Author: Kyle McColgan
//Date: 13 February 2026
//Description: This file contains a custom time formatting helper function built for the React timer project.

export function formatTime(ms)
{
    const totalSeconds = Math.ceil(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = n => (n < 10 ? "0" + n : n);

    if (hours > 0)
    {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(minutes)}:${pad(seconds)}`;
}
