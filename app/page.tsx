"use client";
import { useState, useEffect } from "react";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useCigaretteLog } from "@/hooks/useCigaretteLog";

export default function Home() {
  const { seconds, isRunning, phase, start, stop, reset } = usePomodoro();
  const { logs, addLog } = useCigaretteLog();

  return (
    <>
    <div className="p-8">
      <p className="text-4xl mb-4">
        {phase === "work" ? "作業中🔥" : "休憩中☕️"}</p>
      <p className="text-4xl mb-4">残り: {seconds}秒</p>

      <div className="space-x-2 mt-4">
        <button
          onClick={() => {start()}}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          開始
        </button>
        <button
          onClick={() => {stop()}}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          停止
        </button>
        <button
          onClick={() => {
            reset();
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          リセット
        </button>
      </div>
    </div>
    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-bold mb-4">タバコ記録🚬</h2>

      <button
        onClick={addLog}
        className="bg-orange-500 text-white px-6 py-3 rounded text-lg"
      >
        吸った
      </button>
      
      <p className="mt-4 text-lg">
        今日の本数: {logs.length}本
      </p>

      <div className="mt-4 space-y-2">
        {logs.map((log, index) => (
          <div key={index}>
            {log.timestamp.toLocaleString()} に吸った
          </div>
        ))}
    </div>
    </div>
    </>
  );  
} 