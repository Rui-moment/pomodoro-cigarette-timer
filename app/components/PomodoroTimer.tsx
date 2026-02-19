"use client";
import React, { useEffect, useState } from "react";
import SmokeRing from "./SmokeRing";

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

type SmokeParticle = {
    id: number;
    x: number;
    drift: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
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
    const ringColor = phase === "work" ? "#ff7c55" : "#72b9ff";
    const phaseLabel = phase === "work" ? "FOCUS PHASE" : "COOL DOWN";
    const remainingRatio = Math.min(1, Math.max(0, seconds / total));
    const visualRatio = remainingRatio;
    const paperWidth = Math.max(0.05, visualRatio);
    const smokeRingProgress = remainingRatio;
    const smokeRingColor =
        phase === "work" ? "rgba(255, 172, 146, 0.72)" : "rgba(152, 214, 255, 0.72)";
    const workSmokeBoost =
        phase === "work" ? Math.min(1, Math.max(0, (0.45 - remainingRatio) / 0.45)) : 0;
    const smokeSpawnMs = 360 - Math.round(workSmokeBoost * 170);

    const [flashingBtn, setFlashingBtn] = useState<'start' | 'stop' | 'reset' | null>(null);
    const [smokeParticles, setSmokeParticles] = useState<SmokeParticle[]>([]);
    const btnStyle: React.CSSProperties = {
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.08)",
        color: "#f5f5f5",
    };

    useEffect(() => {
        if (!isRunning || phase !== "work" || seconds === 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setSmokeParticles((prev) => [
                ...prev.slice(-16),
                {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    x: Math.random() * 22 - 11,
                    drift: Math.random() * (46 + workSmokeBoost * 16) - (23 + workSmokeBoost * 8),
                    size: 7 + Math.random() * 12 + workSmokeBoost * 4,
                    duration: 2200 + Math.random() * 1700 - workSmokeBoost * 520,
                    delay: Math.random() * 360,
                    opacity: Math.min(0.9, 0.2 + Math.random() * 0.4 + workSmokeBoost * 0.18),
                },
            ]);
        }, smokeSpawnMs);

        return () => window.clearInterval(timer);
    }, [isRunning, phase, seconds, smokeSpawnMs, workSmokeBoost]);

    const handleBtn = (fn: () => void, name: 'start' | 'stop' | 'reset') => {
        fn();
        setFlashingBtn(name);
    };

    return (
        <div className="w-full flex flex-col items-center gap-8">
            <div
                className="timer-frame w-full rounded-[2rem] relative overflow-visible"
            >
                <div className="timer-frame-content rounded-[calc(2rem-1px)] p-6 md:p-8 relative">
                    <div
                        className={`absolute inset-0 z-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
                            isRunning ? "opacity-95" : "opacity-70"
                        }`}
                        aria-hidden
                    >
                        <SmokeRing progress={smokeRingProgress} size={320} color={smokeRingColor} />
                    </div>

                    <header className="text-center mb-8 relative z-10">
                        <p
                            className="text-[0.68rem] tracking-[0.28em] font-semibold mb-2"
                            style={{ color: phase === "work" ? "#ff9b7d" : "#8bc7ff" }}
                        >
                            {phaseLabel}
                        </p>
                        <span
                            className="font-mono text-5xl font-semibold"
                            style={{ color: '#f5f5f5', fontVariantNumeric: 'tabular-nums' }}
                        >
                            {formatTime(seconds)}
                        </span>
                    </header>

                    <div className="relative z-10 mx-auto max-w-[24rem]">
                        <div className="cigarette-track">
                            <div className="cigarette-filter" />
                            <div className="cigarette-body-shell">
                                <div className={`cigarette-body-bg ${phase === "rest" ? "is-rest" : ""}`} />
                                <div
                                    className={`cigarette-paper ${phase === "rest" ? "is-rest" : ""}`}
                                    style={{
                                        width: `${paperWidth * 100}%`,
                                        transition: "width 820ms cubic-bezier(0.22, 1, 0.36, 1)",
                                    }}
                                >
                                    <div className={`cigarette-tip ${isRunning && phase === "work" ? "is-active" : ""}`} />
                                    <div className={`cigarette-ash ${phase === "rest" ? "is-rest" : ""}`} />
                                    {phase === "work" && smokeParticles.length > 0 && (
                                        <div className="smoke-layer" aria-hidden>
                                            {smokeParticles.map((particle) => (
                                                <span
                                                    key={particle.id}
                                                    className="smoke-particle"
                                                    style={{
                                                        left: `calc(100% + ${particle.x}px)`,
                                                        width: `${particle.size}px`,
                                                        height: `${particle.size}px`,
                                                        animationDuration: `${particle.duration}ms`,
                                                        animationDelay: `${particle.delay}ms`,
                                                        opacity: particle.opacity,
                                                        ["--drift" as string]: `${particle.drift}px`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-end text-[0.72rem] text-zinc-500 tracking-[0.14em]">
                            <span style={{ color: ringColor }}>
                                {Math.round(remainingRatio * 100)}%
                            </span>
                        </div>
                    </div>
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
