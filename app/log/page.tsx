"use client";
import { useTimer } from "../providers/TImerProvider ";

export default function LogPage() {
  const { logs, timeSinceLastLog, averageInterval, savings } = useTimer();

  const cardStyle: React.CSSProperties = {
    background: '#1a1a1f',
    border: '1px solid #2a2a35',
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <p className="text-xs uppercase tracking-widest mb-6" style={{ color: '#9ca3af' }}>記録</p>

      {/* 2×2 Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="p-4 rounded-2xl" style={cardStyle}>
          <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>今日</p>
          <p className="text-2xl font-bold" style={{ color: '#e05c3a' }}>
            {logs.length}
            <span className="text-sm font-normal ml-0.5" style={{ color: '#9ca3af' }}>本</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl" style={cardStyle}>
          <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>前回から</p>
          <p className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>
            {timeSinceLastLog !== null
              ? <>{timeSinceLastLog}<span className="text-sm font-normal ml-0.5" style={{ color: '#9ca3af' }}>分</span></>
              : <span style={{ color: '#6b7280' }}>—</span>
            }
          </p>
        </div>

        <div className="p-4 rounded-2xl" style={cardStyle}>
          <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>平均間隔</p>
          <p className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>
            {averageInterval !== null
              ? <>{averageInterval}<span className="text-sm font-normal ml-0.5" style={{ color: '#9ca3af' }}>分</span></>
              : <span style={{ color: '#6b7280' }}>—</span>
            }
          </p>
        </div>

        <div className="p-4 rounded-2xl" style={cardStyle}>
          <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>節約額</p>
          <p className="text-2xl font-bold" style={{ color: savings >= 0 ? '#22c55e' : '#e05c3a' }}>
            {savings >= 0 ? '+' : '-'}¥{Math.abs(savings)}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#9ca3af' }}>今日の記録</p>

      {logs.length === 0 ? (
        <p className="text-center py-10" style={{ color: '#6b7280' }}>まだ記録がありません</p>
      ) : (
        <div>
          {logs.map((log: { timestamp: Date }, i: number) => {
            const prevLog = logs[i - 1];
            const diffMin = prevLog
              ? Math.round((log.timestamp.getTime() - prevLog.timestamp.getTime()) / 60000)
              : null;

            return (
              <div key={log.timestamp.getTime()} className="flex gap-4">
                {/* Timeline column */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                    style={{ background: '#c084fc' }}
                  />
                  {i < logs.length - 1 && (
                    <div
                      className="w-px flex-1 mt-1"
                      style={{
                        background: 'repeating-linear-gradient(to bottom, #2a2a35 0, #2a2a35 4px, transparent 4px, transparent 8px)',
                        minHeight: '36px',
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6 flex items-start gap-3 flex-wrap">
                  <span className="text-sm font-mono" style={{ color: '#f5f5f5' }}>
                    {log.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{i + 1}本目</span>
                  {diffMin !== null && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(192,132,252,0.1)',
                        border: '1px solid rgba(192,132,252,0.2)',
                        color: '#c084fc',
                      }}
                    >
                      +{diffMin}分後
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
