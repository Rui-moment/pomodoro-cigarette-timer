"use client";
import React from "react";

interface CigaretteTrackerProps {
    logs: { timestamp: Date }[];
    addLog: () => void;
    timeSinceLastLog: number | null;
    averageInterval: number | null;
    savings: number;
}

const CigaretteTracker = React.memo(function CigaretteTracker({
    logs,
    addLog,
    timeSinceLastLog,
    averageInterval,
    savings,
}: CigaretteTrackerProps) {
    return (
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
            <p className="mt-2 text-gray-600">
                {timeSinceLastLog !== null
                ? `前回から ${timeSinceLastLog} 分経過`
                : "まだ吸っていません"}
            </p>
            <p className="mt-2 text-gray-600">
                {averageInterval !== null
                ? `平均間隔: ${averageInterval} 分`
                : ""}
            </p>
            <p className="mt-2">
                {savings >= 0
                ? `✅ ${savings}円節約`
                : `❌ ${Math.abs(savings)}円追加で使っちゃった`}
            </p>

            <div className="mt-4 space-y-2">
                {logs.map((log, index) => (
                    <div key={index}>
                        {log.timestamp.toLocaleString()} に吸った
                    </div>
                ))}
            </div>
        </div>
    );
});

export default CigaretteTracker;