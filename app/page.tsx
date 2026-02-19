"use client";
import { useTimer } from "./providers/TImerProvider ";

export default function Home() {
  const { logs, savings } = useTimer();
  const TARGET = 20;

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const progressPct = Math.min(logs.length / TARGET, 1) * 100;

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>禁煙ポモドーロ</p>
        <p className="text-sm" style={{ color: '#6b7280' }}>{today}</p>
      </div>

      {/* Hero: today's cigarettes */}
      <div
        className="mb-6 py-8 px-6 rounded-2xl"
        style={{ background: '#1a1a1f', border: '1px solid #2a2a35' }}
      >
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#9ca3af' }}>今日の本数</p>
        <p
          className="text-8xl font-bold text-center mb-6"
          style={{ color: '#f5f5f5', fontVariantNumeric: 'tabular-nums' }}
        >
          {logs.length}
        </p>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5" style={{ color: '#6b7280' }}>
            <span>0本</span>
            <span>目標 {TARGET}本</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: '#2a2a35' }}>
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: '#e05c3a' }}
            />
          </div>
          <p className="text-xs mt-1.5 text-right" style={{ color: '#6b7280' }}>
            {logs.length} / {TARGET}本
          </p>
        </div>
      </div>

      {/* Savings card */}
      <div
        className="rounded-2xl p-6"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>
          💰 今日の節約額
        </p>
        <p
          className="text-3xl font-bold"
          style={{ color: savings >= 0 ? '#22c55e' : '#e05c3a' }}
        >
          {savings >= 0 ? `+¥${savings}` : `-¥${Math.abs(savings)}`}
        </p>
      </div>
    </main>
  );
}
