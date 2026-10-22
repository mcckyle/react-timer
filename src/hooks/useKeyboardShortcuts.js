//File name: useKeyboardShortcuts.js
//Author: Kyle McColgan
//Date: 21 October 2026
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
        function handleKeyDown(event)
        {
            if ((event.defaultPrevented) || (event.repeat) || (event.altKey) || (event.ctrlKey) || (event.metaKey))
            {
                return;
            }

            //Ignore typing in inputs.
            const target = event.target;

            if ((target instanceof Element) && (target.closest(
                'input, textarea, select, button, a[href], [contenteditable="true"], [role="button"]'
            )))
            {
                return;
            }

            switch (event.key.toLowerCase())
            {
                case " ":
                    event.preventDefault();
                    running ? onPause() : onStart();
                    break;
                case "r":
                    onReset();
                    break;
                case "m":
                    onToggleMode();
                    break;
                case "h":
                    onToggleHistory();
                    break;
                default:
                    break;
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [running, onStart, onPause, onReset, onToggleMode, onToggleHistory]);
}
