//File name: useTimer.js
//Author: Kyle McColgan
//Date: 9 February 2026
//Description: This file contains the custom timekeeping hook for the React timer project.

import { useEffect, useState, useRef, useCallback } from "react";

export const DEFAULT_DURATION = 10 * 1000; //10 seconds (milliseconds).

export function useTimer()
{
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION); //Time in milliseconds.
    const [running, setRunning] = useState(false);
    const [pastTimers, setPastTimers] = useState([]);

    const intervalRef = useRef(null);
    const lastTickRef = useRef(0);
    const completedRef = useRef(false);

    //Hydrate past timers once...
    useEffect(() => {
        try
        {
            const stored = localStorage.getItem("pastTimers");
            if (stored)
            {
                setPastTimers(JSON.parse(stored));
            }
        } catch {}
    }, []);

    const stopInterval = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const complete = useCallback(() => {
        if (completedRef.current)
        {
            return;
        }

        completedRef.current = true;
        setRunning(false);
        stopInterval();

        const completedTimer = {
            duration,
            completedAt: Date.now(),
        };

        setPastTimers(prev => {
            const updated = [completedTimer, ...prev];
            try
            {
                localStorage.setItem("pastTimers", JSON.stringify(updated));
            } catch {}
            return updated;
        });
    }, [duration]);

    //Countdown loop.
    useEffect(() => {
        if ( ! running)
        {
            stopInterval();
            return;
        }

        lastTickRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const delta = now - lastTickRef.current;
            lastTickRef.current = now;

            setTimeLeft(prev => {
                if (completedRef.current)
                {
                    return prev;
                }

                const next = prev - delta;

                if (next <= 0)
                {
                    complete();
                    return 0;
                }

                return next;
            });
        }, 50);

        return stopInterval;
    }, [running, complete]);

    const start = () => {
        if (timeLeft <= 0)
        {
            setTimeLeft(duration);
        }

        completedRef.current = false;
        setRunning(true);
    };

    const pause = () => setRunning(false);

    const reset = () => {
        stopInterval();
        setRunning(false);
        setTimeLeft(duration);
    };

    const clearPastTimers = useCallback(() => {
        setPastTimers([]);
        try
        {
            localStorage.removeItem("pastTimers");
        } catch {}
    }, []);

    return {
        duration,
        setDuration,
        timeLeft,
        setTimeLeft,
        running,
        start,
        pause,
        reset,
        pastTimers,
        clearPastTimers,
    };
}
