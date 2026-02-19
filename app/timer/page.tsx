"use client";
import { useState } from "react";
import { useTimer } from "../providers/TImerProvider ";
import PomodoroTimer from "@/app/components/PomodoroTimer";

export default function TimerPage() {
  const { seconds, isRunning, phase, start, stop, reset, addLog, timeSinceLastLog } = useTimer();
  const [glowing, setGlowing]   = useState(false);
  const [rippling, setRippling] = useState(false);
  const [floating, setFloating] = useState(false);

  const handleAddLog = () => {
    addLog();
    setGlowing(true);
    setRippling(true);
    setFloating(true);
  };

  return (
    <main
      className="max-w-md mx-auto p-4 flex flex-col items-center justify-center"
      style={{ minHeight: 'calc(100dvh - 80px)' }}
    >
      <PomodoroTimer
        seconds={seconds}
        isRunning={isRunning}
        phase={phase}
        start={start}
        stop={stop}
        reset={reset}
      />

      {/* 前回から経過時間バッジ */}
      {timeSinceLastLog !== null && (
        <div className="mt-6">
          <span
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#9ca3af',
            }}
          >
            前回から {timeSinceLastLog}分経過
          </span>
        </div>
      )}

      {/* 吸ったボタン */}
      <div className="mt-10 w-full relative">
        <button
          onClick={handleAddLog}
          onAnimationEnd={() => setGlowing(false)}
          className={`w-full py-5 rounded-2xl text-xl font-bold cursor-pointer active:scale-[0.94] transition-transform duration-100 ${glowing ? 'glow-burst' : ''}`}
          style={{
            color: '#f5f5f5',
            background: 'rgba(224, 92, 58, 0.15)',
            border: '1px solid rgba(224, 92, 58, 0.4)',
            boxShadow: '0 0 24px rgba(224, 92, 58, 0.12)',
          }}
        >
          🚬 吸った
        </button>

        {/* リップルリング */}
        {rippling && (
          <div
            className="absolute inset-0 rounded-2xl ripple-ring"
            style={{ border: '2px solid rgba(224, 92, 58, 0.7)' }}
            onAnimationEnd={() => setRippling(false)}
          />
        )}

        {/* +1 フロート */}
        {floating && (
          <div
            className="absolute right-5 top-3 float-up text-base font-bold select-none"
            style={{ color: 'rgba(224, 92, 58, 0.9)' }}
            onAnimationEnd={() => setFloating(false)}
          >
            🚬 +1
          </div>
        )}
      </div>
    </main>
  );
}
