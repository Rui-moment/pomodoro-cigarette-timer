"use client";
import React, { useState } from "react";

const WORK_TIME = 3600;
const REST_TIME = 600;

interface PomodoroTimerProps {
    seconds: number;
    phase: "work" | "rest";
    isRunning: boolean;
    start: () => void;
    stop: () => void;
    reset: () => void;
}

const formatTime = (second: number): string => {
    const hours = Math.floor(second / 3600);
    const minutes = Math.floor((second % 3600) / 60);
    const secs = second % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
};

const PomodoroTimer = React.memo(function PomodoroTimer({
    seconds,
    phase,
    isRunning,
    start,
    stop,
    reset,
}: PomodoroTimerProps) {
    const total = phase === "work" ? WORK_TIME : REST_TIME;
    const progress = seconds / total;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);
    const ringColor = phase === "work" ? "#e05c3a" : "#5ca8e0";
    const phaseLabel = phase === "work" ? "作業中" : "休憩中";

    const [flashingBtn, setFlashingBtn] = useState<'start' | 'stop' | 'reset' | null>(null);

    const btnStyle: React.CSSProperties = {
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.08)',
        color: '#f5f5f5',
    };

    const handleBtn = (fn: () => void, name: 'start' | 'stop' | 'reset') => {
        fn();
        setFlashingBtn(name);
    };

    return (
        <div className="flex flex-col items-center gap-8">
            {/* SVG Progress Ring */}
            <div className="relative">
                <svg width="220" height="220" viewBox="0 0 220 220">
                    <circle
                        cx="110"
                        cy="110"
                        r={radius}
                        fill="none"
                        stroke="#2a2a35"
                        strokeWidth="6"
                    />
                    <circle
                        cx="110"
                        cy="110"
                        r={radius}
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 110 110)"
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="font-mono text-4xl font-bold"
                        style={{ color: '#f5f5f5', fontVariantNumeric: 'tabular-nums' }}
                    >
                        {formatTime(seconds)}
                    </span>
                    <span className="text-sm mt-1" style={{ color: ringColor }}>
                        {phaseLabel}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
                <button
                    onClick={() => handleBtn(start, 'start')}
                    onAnimationEnd={() => setFlashingBtn(null)}
                    className={`px-6 py-2 rounded-full text-sm font-medium cursor-pointer active:scale-90 transition-transform duration-100 ${flashingBtn === 'start' ? 'ctrl-glow' : ''}`}
                    style={btnStyle}
                >
                    開始
                </button>
                <button
                    onClick={() => handleBtn(stop, 'stop')}
                    onAnimationEnd={() => setFlashingBtn(null)}
                    className={`px-6 py-2 rounded-full text-sm font-medium cursor-pointer active:scale-90 transition-transform duration-100 ${flashingBtn === 'stop' ? 'ctrl-glow' : ''}`}
                    style={btnStyle}
                >
                    停止
                </button>
                <button
                    onClick={() => handleBtn(reset, 'reset')}
                    onAnimationEnd={() => setFlashingBtn(null)}
                    className={`px-6 py-2 rounded-full text-sm font-medium cursor-pointer active:scale-90 transition-transform duration-100 ${flashingBtn === 'reset' ? 'ctrl-glow' : ''}`}
                    style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#9ca3af',
                    }}
                >
                    リセット
                </button>
            </div>
        </div>
    );
});

export default PomodoroTimer;
