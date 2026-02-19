"use client";
import { createContext, useContext, ReactNode }  from "react";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useCigaretteLog } from "@/hooks/useCigaretteLog";

interface TimerContextType {
    seconds: number;
    isRunning: boolean;
    phase: "work" | "rest";
    start: () => void;
    stop: () => void;
    reset: () => void;
    //useCigaretteLog
    logs: Array<{ timestamp: Date; }>
    todayKey: string;
    dailyLogMap: Record<string, Array<{ timestamp: Date }>>;
    addLog: () => void;
    timeSinceLastLog: number | null;
    averageInterval: number | null;
    savings: number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export function TimerProvider({ children }: { children: ReactNode }) {
    const pomodoro = usePomodoro();
    const cigaretteLog = useCigaretteLog();

    const value = {
        ...pomodoro,
        ...cigaretteLog,
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimer must be used within a TimerProvider");
    }
    return context;
}
