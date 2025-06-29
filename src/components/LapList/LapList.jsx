//File name: LapList.jsx
//Author: Kyle McColgan
//Date: 26 June 2025
//Description: This file contains the Lap component for the React timer site.

import React from "react";
import styles from "./LapList.module.css";
import { formatTime } from "../../utils/formatTime";
import { useTheme } from "../../hooks/useTheme";

const LapList = ({ laps }) => {

    const theme = useTheme();

    return (
        <div className = {theme}>
            <div className={styles.lapList}>
                {laps.map((lap, index) => {
                    const lapNumber = laps.length - index;
                    const { hours, minutes, seconds, centiSeconds } = formatTime(lap, true);

                    return (
                        <div key={index} className={styles.lap}>
                            <div className = {styles.lapLabel}>Lap {lapNumber}</div>
                            <div className = {styles.lapSeparator}> </div>
                            <div className = {styles.lapTime}>
                                {hours !== "00"
                                    ? `${hours}:${minutes}:${seconds}.${centiSeconds}`
                                    : `${minutes}:${seconds}.${centiSeconds}`
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LapList;
