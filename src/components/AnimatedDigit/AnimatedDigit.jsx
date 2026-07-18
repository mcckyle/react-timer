//File name: AnimatedDigit.jsx
//Author: Kyle McColgan
//Date: 17 July 2026
//Description: This file contains the digits component for the timer React project.

import React from "react";
import { motion } from "motion/react";
import "./AnimatedDigit.css";

const TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1], };

const AnimatedDigit = ({ value, isCenti = false }) => {
  const className = `digit${isCenti ? " centi" : ""}`;

  return (
    <span className={className} aria-hidden="true">
      <motion.span
        key={value}
        className="value"
        initial={{ opacity: 0.4, y: "10%", scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={TRANSITION}
      >
        {value}
      </motion.span>
    </span>
  );
};

export default AnimatedDigit;
