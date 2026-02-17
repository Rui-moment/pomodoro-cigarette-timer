"use client";
import PomodoroTimer from "./components/PomodoroTimer";
import CigaretteTracker from "./components/CigaretteTracker";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useCigaretteLog } from "@/hooks/useCigaretteLog";

export default function Home() {
  const { seconds, isRunning, phase, start, stop, reset } = usePomodoro();
  const { logs, addLog, timeSinceLastLog, averageInterval, savings } = useCigaretteLog();

  return (
    <>
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">🍅禁煙ポモドーロ🍅</h1>
      <PomodoroTimer
        seconds={seconds}
        isRunning={isRunning}
        phase={phase}
        start={start}
        stop={stop}
        reset={reset}
      />
      <CigaretteTracker
        logs={logs}
        addLog={addLog}
        timeSinceLastLog={timeSinceLastLog}
        averageInterval={averageInterval}
        savings={savings}
      />
    </main>
    </>
  );  
} 
 