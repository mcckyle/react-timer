//File name: formatDuration.jsx
//Author: Kyle McColgan
//Date: 1 April 2026
//Description: This file contains a custom time formatting helpers built for the timer React project.

export function formatDuration(ms)
{
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, "0");

    if (hours > 0)
    {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    if (minutes > 0)
    {
        return `${minutes}:${pad(seconds)}`;
    }

    return `${seconds}`;
}

export function formatTime(date)
{
    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

export function toValidDate(value)
{
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}
