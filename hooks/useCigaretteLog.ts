"use client";
import { useState } from "react";

interface CigaretteLog {
    timestamp: Date;
}

export function useCigaretteLog() {
    const [logs, setLogs] = useState<CigaretteLog[]>([]);

    const addLog = () => {
        const now = new Date();
        setLogs([...logs, { timestamp: now }]);
    }
    return { logs, addLog };
}