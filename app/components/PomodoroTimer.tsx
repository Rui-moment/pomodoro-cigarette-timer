"use client";
import React from "react";

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
    const seconds = second % 60;

    if (hours > 0) {
        //1時間以上の場合
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
        //1時間未満の場合
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}

const PomodoroTimer = React.memo(function PomodoroTimer({
    seconds,
    phase,
    isRunning,
    start,
    stop,
    reset,
}: PomodoroTimerProps) {
    return (
        <div className="p-8">
            <p className="text-4xl mb-4">
                {phase === "work" ? "作業中🔥" : "休憩中☕️"}
            </p>
            <p className="text-4xl mb-4">残り: {formatTime(seconds)}</p>

            <div className="space-x-2 mt-4">
                <button
                    onClick={start}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    開始
                </button>
                <button
                    onClick={stop}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    停止
                </button>
                <button
                    onClick={reset}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    リセット
                </button>
            </div>
        </div>
    );
});

export default PomodoroTimer;