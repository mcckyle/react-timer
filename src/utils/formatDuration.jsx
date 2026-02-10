//File name: formatDuration.jsx
//Author: Kyle McColgan
//Date: 9 February 2026
//Description: This file contains a custom time formatting helper function built for the React timer project.

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
