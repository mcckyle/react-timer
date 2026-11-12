//File name: useCompletionSound.js
//Author: Kyle McColgan
//Date: 12 November 2026
//Description: This file contains the completion sound hook implementation for the timer React project.

import { useEffect, useRef } from "react";

const SOUND_PATH = "/react-timer/sounds/bell.mp3";
const VOLUME_VISIBLE = 0.6;
const VOLUME_HIDDEN = 0.8;

export function useCompletionSound(trigger)
{
    const audioRef = useRef(null);

    useEffect(() =>
    {
        //Respect the user's system preferences without
        //touching browser APIs during render.
        if ((!trigger) || (typeof window === "undefined"))
        {
            return;
        }

        try
        {
            //Create one reusable audio element when first needed.
            if (!audioRef.current)
            {
                const audio = new Audio(SOUND_PATH);
                audio.preload = "auto";
                audioRef.current = audio;
            }

            const audio = audioRef.current;

            //Keep playback volume appropriate to document visibility.
            audio.volume =
              typeof document !== "undefined" &&
              document.visibilityState === "visible"
                ? VOLUME_VISIBLE
                : VOLUME_HIDDEN;

            //Restart playback if the sound is triggered again.
            audio.currentTime = 0;

            //Playback failure must never interrupt timer completion.
            const playback = audio.play();

            if ((playback) && (typeof playback.catch === "function"))
            {
                playback.catch(() => {});
            }
        }
        catch
        {
            //Audio may be unavailable or blocked by the browser.
        }
    }, [trigger]);

    //Release the audio resource when the hook unmounts.
    useEffect(() =>
    {
        return () => {
            const audio = audioRef.current;

            if (!audio)
            {
                return;
            }

            audio.pause();
            audio.currentTime = 0;
            audioRef.current = null;
        }
    }, []);
}
