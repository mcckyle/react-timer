//File name: formatDuration.jsx
//Author: Kyle McColgan
//Date: 10 March 2026
//Description: This file contains a custom time formatting helpers built for the timer React project.

export function formatDuration(ms)
{
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0)
    {
        return `${h}h ${m}m`;
    }
    if (m > 0)
    {
        return `${m}m ${s}s`;
    }

    return `${s}s`;
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
