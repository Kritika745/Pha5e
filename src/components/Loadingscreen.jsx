"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import "@fontsource/archivo-black";

const LoadingScreen = ({ onLoadingComplete }) => {
  const controls = useAnimation();
  const text = "PHA5E";
  const fontSize = 12;
  const strokeWidth = 0.05;
  const strokeColor = "#ffffff";
  const fillColor = "#ffffff";
  const outlineDuration = 1.5; // Ensures visibility
  const fillDuration = 1.6; // Ensures full fill before exit

  useEffect(() => {
    const timeout = setTimeout(() => {
      controls
        .start({
          scale: [1, 1.5, 8], // Smooth zoom-out
          opacity: [1, 0.5, 0],
          transition: {
            duration: 0.6, // Quick fade-out
            ease: "easeInOut",
          },
        })
        .then(() => {
          console.log("Loading animation complete");
          onLoadingComplete(); // Triggers only AFTER full animation
        });
    }, (outlineDuration + fillDuration) * 1000); // Ensures full animation before transition

    return () => clearTimeout(timeout);
  }, [controls, onLoadingComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#212121] z-50">
      <svg
        width="40%"
        height="auto"
        viewBox={`0 0 ${text.length * fontSize * 0.8} ${fontSize * 1.2}`}
      >
        {/* Mask Definition for Bottom-to-Top Fill Animation */}
        <defs>
          <mask id="reveal-mask">
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="white"
              initial={{ y: fontSize * 1.2 }}
              animate={{ y: 0 }}
              transition={{
                duration: fillDuration,
                ease: "easeInOut",
                delay: outlineDuration - 0.2, // Ensures slight overlap
              }}
            />
          </mask>
        </defs>

        {/* Filled Text with Mask for Bottom-to-Top Reveal */}
        <text
          x="0"
          y={fontSize}
          fontSize={fontSize}
          fontFamily="Archivo Black, sans-serif"
          fill={fillColor}
          mask="url(#reveal-mask)"
        >
          {text}
        </text>

        {/* Outline Animation */}
        <motion.text
          x="0"
          y={fontSize}
          fontSize={fontSize}
          fontFamily="Archivo Black, sans-serif"
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          initial={{ strokeDasharray: "0 100%" }}
          animate={{ strokeDasharray: "100% 0" }}
          transition={{
            duration: outlineDuration,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>
      </svg>
    </div>
  );
};

export default LoadingScreen;
