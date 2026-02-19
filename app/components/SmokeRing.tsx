"use client";
import { useId } from "react";

interface SmokeRingProps {
  progress: number;
  size?: number;
  color?: string;
}

export default function SmokeRing({
  progress,
  size = 300,
  color = "rgba(255,255,255,0.7)",
}: SmokeRingProps) {
  const strokeWidth = 14;
  const radius = size / 2 - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - safeProgress);

  const id = useId().replace(/:/g, "");
  const filterBase = `smoke-base-${id}`;
  const filterMoving = `smoke-moving-${id}`;

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none select-none"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0 overflow-visible">
        <defs>
          <filter id={filterBase}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025"
              numOctaves="4"
              seed="1"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
            <feGaussianBlur stdDeviation="1.5" />
          </filter>

          <filter id={filterMoving}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="3"
              seed="0"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="15s"
                values="0.02;0.03;0.015;0.02"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth / 2}
          fill="none"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `url(#${filterMoving})`,
            transform: "rotate(-90deg)",
            transformOrigin: "center",
            opacity: 1,
            transition: "stroke-dashoffset 1s linear",
          }}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `url(#${filterBase})`,
            transform: "rotate(-90deg)",
            transformOrigin: "center",
            opacity: 0.8,
            transition: "stroke-dashoffset 1s linear",
          }}
        />
      </svg>
    </div>
  );
}
