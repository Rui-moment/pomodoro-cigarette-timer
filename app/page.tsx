"use client";
import { useState, useEffect } from "react";

type phase = "work" | "rest";

const WORK_TIME = 10; // 10(秒) 後で本番値に変更
const REST_TIME = 5; // 5(秒) 後で本番値に変更

export default function Home() {
  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isRuning, setIsRuning] = useState(false);
  const [phase, setPhase] = useState<phase>("work");

  useEffect(() => {
    if (!isRuning || seconds === 0) {
      return;
    }
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, isRuning]);

  useEffect(() => {
    if (seconds === 0 && isRuning) {
      if (phase === "work") {
        setPhase("rest");
        setSeconds(REST_TIME);
      } else {
        setPhase("work");
        setSeconds(WORK_TIME);
      }
    }
  }, [seconds, isRuning, phase]);

  return (
    <div className="p-8">
      <p className="text-4xl mb-4">
        {phase === "work" ? "作業中🔥" : "休憩中☕️"}</p>
      <p className="text-4xl mb-4">残り: {seconds}秒</p>

      <div className="space-x-2 mt-4">
        <button
          onClick={() => setIsRuning(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          開始
        </button>
        <button
          onClick={() => setIsRuning(false)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          停止
        </button>
        <button
          onClick={() => {
            setSeconds(phase === "work" ? WORK_TIME : REST_TIME);
            setIsRuning(false);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          リセット
        </button>
      </div>
    </div>
  );
}