"use client";
import { useTimer } from "../providers/TImerProvider ";
import PomodoroTimer from "@/app/components/PomodoroTimer";

export default function TimerPage() {
  const { seconds, isRunning, phase, start, stop, reset } = useTimer();
  const { addLog, timeSinceLastLog } = useTimer();

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">🍅 タイマー</h1>
      
      <PomodoroTimer
        seconds={seconds}
        isRunning={isRunning}
        phase={phase}
        start={start}
        stop={stop}
        reset={reset}
      />

      {/* 吸ったボタン */}
      <div className="mt-8 border-t pt-8">
        <button
          onClick={addLog}
          className="bg-orange-500 text-white px-8 py-4 rounded-lg text-xl w-full"
        >
          🚬 吸った
        </button>
        
        {timeSinceLastLog !== null && (
          <p className="mt-4 text-center text-gray-600">
            前回から{timeSinceLastLog}分経過
          </p>
        )}
      </div>
    </main>
  );
}