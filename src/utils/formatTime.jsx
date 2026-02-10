//File name: formatTime.jsx
//Author: Kyle McColgan
//Date: 9 February 2026
//Description: This file contains a custom time formatting helper function built for the React timer project.

export function formatTime(ms)
{
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = n => (n < 10 ? "0" + n : n);

    return `${pad(minutes)}:${pad(seconds)}`;
}
