"use client";
import { useMemo, useState } from "react";
import PeriodTabs from "@/app/components/log/PeriodTabs";
import { DAY_PARTS, DayPartId, isHourInRange } from "@/app/components/log/log-utils";
import { useTimer } from "../providers/TImerProvider ";

export default function LogPage() {
  const { logs } = useTimer();
  const [activeDayPart, setActiveDayPart] = useState<DayPartId>("morning");

  const todayDayParts = useMemo(() => {
    const points = DAY_PARTS.map((part) => ({
      ...part,
      count: logs.filter((log) =>
        isHourInRange(log.timestamp.getHours(), part.startHour, part.endHour),
      ).length,
    }));
    const maxCount = Math.max(1, ...points.map((point) => point.count));

    return { points, maxCount };
  }, [logs]);

  const selectedSummary = useMemo(() => {
    const target = todayDayParts.points.find((part) => part.id === activeDayPart);
    return {
      label: target?.label ?? "朝",
      count: target?.count ?? 0,
      color: target?.color ?? "#e05c3a",
    };
  }, [activeDayPart, todayDayParts.points]);

  const selectedRatio = logs.length === 0
    ? 0
    : Math.round((selectedSummary.count / logs.length) * 100);

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>
          今日の記録
        </p>
        <p className="text-sm" style={{ color: "#6b7280" }}>
          時間帯ごとの傾向を確認
        </p>
      </div>

      <PeriodTabs active="today" />

      <div className="mb-5 rounded-2xl p-5" style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              今日の本数
            </p>
            <p className="text-4xl font-bold" style={{ color: "#e05c3a" }}>
              {logs.length}
              <span className="text-base font-normal ml-1" style={{ color: "#9ca3af" }}>
                本
              </span>
            </p>
          </div>
        </div>
      </div>

      {logs.length === 0 ? (
        <p className="text-center py-10" style={{ color: "#6b7280" }}>
          まだ記録がありません
        </p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}>
            <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
              時間帯サマリー
            </p>
            <div className="grid grid-cols-2 gap-2">
              {todayDayParts.points.map((part) => (
                <button
                  type="button"
                  key={part.id}
                  onClick={() => setActiveDayPart(part.id)}
                  className="rounded-xl p-3 text-left transition-all duration-200"
                  style={{
                    background: activeDayPart === part.id ? `${part.color}22` : "rgba(255,255,255,0.03)",
                    border: activeDayPart === part.id ? `1px solid ${part.color}` : `1px solid ${part.color}55`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: "#9ca3af" }}>
                      {part.label}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "#f5f5f5" }}>
                      {part.count}本
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#2a2a35" }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round((part.count / todayDayParts.maxCount) * 100)}%`,
                        background: part.color,
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}>
            <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
              選択中の時間帯
            </p>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${selectedSummary.color}66` }}>
              <div className="flex items-end justify-between">
                <p className="text-sm font-semibold" style={{ color: selectedSummary.color }}>
                  {selectedSummary.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: "#f5f5f5" }}>
                  {selectedSummary.count}
                  <span className="text-sm font-normal ml-1" style={{ color: "#9ca3af" }}>
                    本
                  </span>
                </p>
              </div>
              <p className="text-xs mt-2" style={{ color: "#9ca3af" }}>
                全体の {selectedRatio}% を占めています
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
