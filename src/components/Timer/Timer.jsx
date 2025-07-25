//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 22 July 2025
//Description: This file contains the main parent Timer component for the React timer site.

import React, { useState, useEffect, useRef } from "react";
import { Clock, Sun, Moon } from "lucide-react";
import { useStopwatch } from "../../hooks/useStopwatch";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useTheme } from "../../hooks/useTheme";
import TimerDisplay from "../TimerDisplay/TimerDisplay.jsx";
import TimerControls from "../TimerControls/TimerControls";
import LapList from "../LapList/LapList.jsx";
import HelpModal from "../HelpModal/HelpModal.jsx";
import styles from './Timer.module.css';

const LAP_STORAGE_KEY = "timer-app-laps"; //Key for browser localStorage.

const Timer = ({ dark, toggleTheme }) => {
  const { time, isRunning, toggle, reset, getCurrentTime } = useStopwatch();
  const [laps, setLaps] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  const theme = useTheme();
  const hasLoadedLaps = useRef(false);

  const recordLap = () => {
    const current = getCurrentTime();
    setLaps((prev) => [current, ...prev]);
  };

  useEffect(() => {
    console.log("Current laps state: ", laps);
  }, [laps]);

  //Load laps from browser localStorage.
  useEffect(() => {

    if (!hasLoadedLaps.current)
    {
        const savedLaps = localStorage.getItem(LAP_STORAGE_KEY);
        console.log("useEffect running on mount, raw saved laps: ", savedLaps);

        if (savedLaps)
        {
            try
            {
                const parsed = JSON.parse(savedLaps);
                console.log("Parsed laps from localStorage: ", parsed);
                setLaps(parsed);
            }
            catch (e)
            {
                console.error("Error occured while parsing saved laps: ", e);
            }
        }
        else
        {
            console.log("INFO: No laps found in the browser's localStorage.")
        }
        hasLoadedLaps.current = true;
    }
  }, []);

  //Save laps array to browser localStorage only after initial load.
  useEffect(() => {
    if (hasLoadedLaps.current)
    {
        console.log("INFO: Saving the laps to the browser's localStorage: ", laps);
        localStorage.setItem(LAP_STORAGE_KEY, JSON.stringify(laps));
    }
    else
    {
        console.log("Skipped saving laps...");
    }
  }, [laps]);

  useKeyboardShortcuts({
    onToggle: toggle,
    onReset: reset,
    onLap: recordLap,
    onOpenHelp: () => setShowHelp(true),
  });

  return (
    <div className={theme}>
      <div className={styles.container}>
        <div className={styles.bannerWrapper}>
            <h1 className={styles.banner}>
                <Clock size={32} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                <span className={styles.bannerText}>L'horlage</span>
            </h1>
            <button
                className={styles.themeToggle}
                onClick={toggleTheme}
                title="Toggle theme"
                aria-label="Toggle theme"
            >
                {dark ? <Sun size={20} color="#facc15" /> : <Moon size={20} color="#38bdf8" />}
            </button>
            </div>

            <div className = {styles.frame}>
                <div className = {styles.box}>
                    <TimerDisplay time={time} />
                    <TimerControls
                        isRunning={isRunning}
                        toggle={toggle}
                        reset={reset}
                        time={time}
                        recordLap={recordLap}
                    />
                    <div className={styles.clockEmblem}>
                        <Clock size={56} color="#d4af37" strokeWidth={1.5} />
                    </div>
                    <div className={styles.lapListWrapper}>
                        <LapList laps={laps} />
                    </div>
                </div>
            </div>
                {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
          </div>
        </div>
  );
};

export default Timer;
