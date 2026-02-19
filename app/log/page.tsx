"use client";
import { useTimer } from "../providers/TImerProvider ";

export default function LogPage() {
  const { logs, timeSinceLastLog, averageInterval, savings } = useTimer();

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">📊 記録</h1>
      
      {/* 統計情報 */}
      <div className="space-y-4 mb-8">
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-bold">今日の本数</p>
          <p className="text-3xl font-bold text-orange-500">{logs.length}本</p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">前回から</p>
          <p className="text-xl font-bold">
            {timeSinceLastLog !== null ? `${timeSinceLastLog}分経過` : "まだ記録なし"}
          </p>
        </div>

        {averageInterval !== null && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">平均間隔</p>
            <p className="text-xl font-bold">{averageInterval}分</p>
          </div>
        )}

        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">節約額</p>
          <p className="text-xl font-bold">
            {savings >= 0 ? `✅ ${savings}円節約` : `❌ ${Math.abs(savings)}円オーバー`}
          </p>
        </div>
      </div>

      {/* 今日の記録一覧 */}
      <div>
        <h2 className="text-lg font-bold mb-4">今日の記録</h2>
        <div className="space-y-2">
          {logs.map((log: { timestamp: Date; }) => (
            <div key={log.timestamp.getTime()} className="p-3 bg-gray-50 rounded">
              {log.timestamp.toLocaleTimeString()} に吸った
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}