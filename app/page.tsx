"use client";
import { useState, useEffect } from "react";
import { usePomodoro } from "@/hooks/usePomodoro";

export default function Home() {
  const { seconds, isRunning, phase, start, stop, reset } = usePomodoro();

  return (
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
  );
}