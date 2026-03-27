//File name: useCompletionSound.js
//Author: Kyle McColgan
//Date: 24 March 2026
//Description: This file contains the completion sound hook implementation for the timer React project.

import { useEffect, useRef } from "react";

export function useCompletionSound(trigger)
{
    const audioRef = useRef(null);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    useEffect(() => {
        //Lazy init (avoids autoplay restrictions issues).
        if (!audioRef.current)
        {
            audioRef.current = new Audio("/react-timer/sounds/bell.mp3");
            audioRef.current.preload = "auto";
            audioRef.current.volume = 0.6;
        }

        if ((trigger) && (!prefersReducedMotion))
        {
            setTimeout(() => {
                const audio = audioRef.current;
                audio.volume = document.visibilityState === "visible" ? 0.6 : 0.8;
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }, 120);
        }
    }, [trigger]);
}
