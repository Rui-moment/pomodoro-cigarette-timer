"use client";
import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Phase = "work" | "rest";

const WORK_TIME = 10;
const REST_TIME = 5;

export function usePomodoro() {
  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("work");
  const [endTime, setEndTime] = useLocalStorage<number | null>(
    'pomodoroEndTime',
    null
  );

  // タイマー: 残り時間の計算のみ
  useEffect(() => {
    if (!isRunning || !endTime) {
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setSeconds(remaining);
    };

    tick(); // 即座に1回実行して最初の1秒飛びを防ぐ
    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [isRunning, endTime]); // ← phase を外した

  // フェーズ切り替え: 0秒になったときの処理
  useEffect(() => {
    if (seconds === 0 && isRunning) {
      setIsRunning(false);
      setEndTime(null);
      
      if (phase === "work") {
        setPhase("rest");
        setSeconds(REST_TIME);
        const newEnd = Date.now() + (REST_TIME * 1000);
        setEndTime(newEnd);
        setIsRunning(true);
      } else {
        setPhase("work");
        setSeconds(WORK_TIME);
        const newEnd = Date.now() + (WORK_TIME * 1000);
        setEndTime(newEnd);
        setIsRunning(true);
      }
    }
  }, [seconds, isRunning, phase]);

  const start = () => {
    const end = Date.now() + (seconds * 1000);
    setEndTime(end);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setSeconds(phase === "work" ? WORK_TIME : REST_TIME);
    setEndTime(null);
  };

  return {
    seconds,
    isRunning,
    phase,
    start,
    stop,
    reset,
  };
}