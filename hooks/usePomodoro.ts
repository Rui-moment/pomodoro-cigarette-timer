"use client";
import { useState, useEffect } from "react";

type phase = "work" | "rest";

const WORK_TIME = 10;
const REST_TIME = 5;

export function usePomodoro() {
    const [seconds, setSeconds] = useState(WORK_TIME);
const [isRunning, setIsRunning] = useState(false);
const [phase, setPhase] = useState<phase>("work");

useEffect(() => {
  if (!isRunning || seconds === 0) {
    return;
  }
  
  const timer = setInterval(() => {
    setSeconds((prev) => prev - 1);
  }, 1000);
  
  return () => clearInterval(timer);
}, [seconds, isRunning]);

useEffect(() => {
  if (seconds === 0 && isRunning) {
    if (phase === "work") {
      setPhase("rest");
      setSeconds(REST_TIME);
    } else {
      setPhase("work");
      setSeconds(WORK_TIME);
    }
  }
}, [seconds, isRunning, phase]);
 const start = () => {
    setIsRunning(true);
 }
 const stop = () => {
    setIsRunning(false);
 }
 const reset = () => {
    setIsRunning(false);
    setSeconds(phase === "work" ? WORK_TIME : REST_TIME);
 }

 return {
    seconds,
    isRunning,
    phase,
    start,
    stop,
    reset,
 }
}