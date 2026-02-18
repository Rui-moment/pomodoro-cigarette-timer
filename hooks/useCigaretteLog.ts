"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface CigaretteLog {
    timestamp: Date;
}
interface DailyHistory {
    currentDate: string; // "2026-02-18"
    todayLogs: CigaretteLog[];
    history: {
        [date: string]: CigaretteLog[];
    }
}

const TARGET_CIGARETTES = 20;
const PRICE_PER_CIGARETTE = 30; //todo:ユーザー側で設定できるようにする
const getTodayString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0]; //"2026-02-18"
}

export function useCigaretteLog() {
    const [dailyHistory, setDailyHistory] = useLocalStorage<DailyHistory>(
        'cigaretteLogs',
        {
            currentDate: getTodayString(),
            todayLogs: [],
            history: {}
        },
        (savedValue) => {
            const parsed = JSON.parse(savedValue);
            return {
                currentDate: parsed.currentDate ?? getTodayString(),
                todayLogs: (parsed.todayLogs ?? []).map((log: any) => ({
                    timestamp: new Date(log.timestamp),
                })),
                history: Object.fromEntries(
                    (Object.entries(parsed.history ?? {}) as [string, any[]][]).map(([date, logs]) => [
                        date,
                        logs.map((log: any) => ({
                            timestamp: new Date(log.timestamp),
                        })),
                    ])
                )
            }
        }
    );
    useEffect(() => {
        const today = getTodayString();
        if (dailyHistory.currentDate !== today) {
            setDailyHistory({
                currentDate: today,
                todayLogs: [],
                history: {
                    ...dailyHistory.history,
                    [dailyHistory.currentDate]: dailyHistory.todayLogs,
                },
            });
        }
    }, []);

    const [now, setNow] = useState(new Date());

    const addLog = useCallback(() => {
        const currentCheck = new Date();
        setDailyHistory({
            ...dailyHistory,
            todayLogs: [...dailyHistory.todayLogs, { timestamp: currentCheck }],
        });
        setNow(currentCheck);
    }, [dailyHistory]);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 60000); // 1分ごとに更新

        return () => clearInterval(timer);
    }, []);

    const timeSinceLastLog = useMemo(() => {
        if (dailyHistory.todayLogs.length === 0) {
            return null;
        }
        const lastLog = dailyHistory.todayLogs[dailyHistory.todayLogs.length - 1];
        const diffMs = now.getTime() - lastLog.timestamp.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        return Math.max(0, diffMins);
    }, [dailyHistory.todayLogs, now]);

    const averageInterval = useMemo(() => {
        if (dailyHistory.todayLogs.length < 2) {
            return null;  //2本未満なら計算できない
        }


        let tatalMs = 0; //合計（ミリ秒）
        for (let i = 1; i < dailyHistory.todayLogs.length; i++) {
            const diff = dailyHistory.todayLogs[i].timestamp.getTime() - dailyHistory.todayLogs[i-1].timestamp.getTime();
            tatalMs += diff;
        }
        const avgMs = tatalMs / (dailyHistory.todayLogs.length - 1);
        const avgMin = Math.floor(avgMs / 60000);
        return avgMin;
    }, [dailyHistory.todayLogs]);

    const savings = useMemo(() => {
        return (TARGET_CIGARETTES - dailyHistory.todayLogs.length) * PRICE_PER_CIGARETTE;
    }, [dailyHistory.todayLogs]);

    return {
        logs: dailyHistory.todayLogs,
        addLog,
        timeSinceLastLog,
        averageInterval,
        savings,
    };  
}
