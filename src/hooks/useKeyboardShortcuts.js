//File name: useKeyboardShortcuts.js
//Author: Kyle McColgan
//Date: 24 March 2026
//Description: This file contains the keyboard shortcuts implementation for the timer React project.

import { useEffect } from "react";

export function useKeyboardShortcuts({
    running,
    onStart,
    onPause,
    onReset,
    onToggleMode,
    onToggleHistory,
})
{
    useEffect(() => {
        function handleKeyDown(e)
        {
            //Ignore typing in inputs.
            const tag = e.target.tagName;
            if ( (tag === "INPUT") || (tag === "TEXTAREA") )
            {
                return;
            }

            //Prevent page scroll on space.
            if (e.code === "Space")
            {
                e.preventDefault();
                running ? onPause() : onStart();
                return;
            }

            if (e.key.toLowerCase() === "r")
            {
                onReset();
                return;
            }

            if (e.key.toLowerCase() === "m")
            {
                onToggleMode();
                return;
            }

            if (e.key.toLowerCase() === "h")
            {
                onToggleHistory();
                return;
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [running, onStart, onPause, onReset, onToggleMode, onToggleHistory]);
}
