"use client";
import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Phase = "work" | "rest";

const WORK_TIME = 3600; //60分
const REST_TIME = 600; //10分

export function usePomodoro() {
  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("work");
  const [endTime, setEndTime] = useLocalStorage<number | null>(
    'pomodoroEndTime',
    null
  );
  //通知の許可をリクエスト(初回のみ)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);
  //通知
  const sendNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body,
            });
        }
    }
  }
  //タイマー: 残り時間の計算のみ
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
        //作業終了 => 休憩開始
        sendNotification("作業終了！", "休憩しましょう");
        setPhase("rest");
        setSeconds(REST_TIME);
        const newEnd = Date.now() + (REST_TIME * 1000);
        setEndTime(newEnd);
        setIsRunning(true);
      } else {
        //休憩終了 => 作業開始
        sendNotification("休憩終了！", "作業を再開しましょう🔥");
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