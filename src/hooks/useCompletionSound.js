//File name: useCompletionSound.js
//Author: Kyle McColgan
//Date: 28 August 2026
//Description: This file contains the completion sound hook implementation for the timer React project.

import { useEffect, useRef } from "react";

const SOUND_PATH = "/react-timer/sounds/bell.mp3";
const VOLUME_VISIBLE = 0.60;
const VOLUME_HIDDEN = 0.80;

export function useCompletionSound(trigger)
{
    const audioRef = useRef(null);

    useEffect(() => {
        //Respect the user's system preferences without
        //touching browser APIs during render.
        if ((typeof window === "undefined") || (typeof window.matchMedia != "function"))
        {
            return;
        }

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        //Reduced motion is treated as a signal to keep
        //the completion experience quiet.
        if (mediaQuery.matches)
        {
            return;
        }

        //Lazily create one reusable audio element.
        //Keeping the element alive avoids unnecessary
        //allocations and lets subsequent completions
        //restart the same sound cleanly.
        if (!audioRef.current)
        {
            const audio = new Audio(SOUND_PATH);
            audio.preload = "auto";
            audio.volume = VOLUME_VISIBLE;

            audioRef.current = audio;
        }

        const audio = audioRef.current;

        //Trigger only when completion becomes active.
        if (!trigger)
        {
            return;
        }

        audio.volume = document.visibilityState === "visible" ? VOLUME_VISIBLE : VOLUME_HIDDEN;
        audio.currentTime = 0;

        //Browsers may reject playback when the user has
        //not interacted with the page yet. Completion
        //sound failure should never affect the timer.
        audio.play().catch(() => {});


        if (trigger)
        {
            setTimeout(() => {
            }, 120);
        }
    }, [trigger]);
}
