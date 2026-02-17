"use client";
import { useState, useMemo } from "react";

interface CigaretteLog {
    timestamp: Date;
}

const TARGET_CIGARETTES = 20;
const PRICE_PER_CIGARETTE = 30; //todo:ユーザー側で設定できるようにする

export function useCigaretteLog() {
    const [logs, setLogs] = useState<CigaretteLog[]>([]);

    const addLog = () => {
        const now = new Date();
        setLogs([...logs, { timestamp: now }]);
    }

    const timeSinceLastLog = useMemo(() => {
        if (logs.length === 0) {
            return null;
        }
        const now = new Date();
        const lastLog = logs[logs.length - 1];
        const diffMs = now.getTime() - lastLog.timestamp.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        return diffMins;
    }, [logs]);

    const averageInterval = useMemo(() => {
        if (logs.length < 2) {
            return null;  //2本未満なら計算できない
        }

    
        let tatalMs = 0; //合計（ミリ秒）
        for (let i = 1; i < logs.length; i++) {
            const diff = logs[i].timestamp.getTime() - logs[i-1].timestamp.getTime();
            tatalMs += diff;
        }
        const avgMs = tatalMs / (logs.length - 1);
        const avgMin = Math.floor(avgMs / 60000);
        return avgMin;
    }, [logs]);

    const savings = useMemo(() => {
        return (TARGET_CIGARETTES - logs.length) * PRICE_PER_CIGARETTE;
    }, [logs]);

    return {
        logs,
        addLog,
        timeSinceLastLog,
        averageInterval,
        savings,
    };  
}
