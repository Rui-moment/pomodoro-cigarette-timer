"use client";
import { useMemo } from "react";
import PeriodTabs from "@/app/components/log/PeriodTabs";
import TrendChart from "@/app/components/log/TrendChart";
import {
  buildRangePoints,
  calculateLogStreak,
} from "@/app/components/log/log-utils";
import { useTimer } from "../../providers/TImerProvider ";

const TARGET_DAILY = 20;

export default function WeekLogPage() {
  const { dailyLogMap } = useTimer();

  const points = useMemo(() => buildRangePoints(7, dailyLogMap), [dailyLogMap]);
  const periodTotal = useMemo(() => points.reduce((sum, point) => sum + point.count, 0), [points]);
  const daysWithLogs = useMemo(() => points.filter((point) => point.count > 0).length, [points]);
  const smokeFreeDays = 7 - daysWithLogs;
  const averagePerDay = (periodTotal / 7).toFixed(1);
  const peakPoint = useMemo(
    () => points.reduce((max, point) => (point.count > max.count ? point : max), points[0]),
    [points],
  );
  const logStreak = useMemo(() => calculateLogStreak(dailyLogMap), [dailyLogMap]);

  const reductionTrend = useMemo(() => {
    const firstHalf = points.slice(0, 3).reduce((sum, point) => sum + point.count, 0) / 3;
    const secondHalf = points.slice(-3).reduce((sum, point) => sum + point.count, 0) / 3;
    return secondHalf - firstHalf;
  }, [points]);

  const badgeItems = useMemo(() => {
    const items: Array<{ title: string; desc: string; color: string }> = [];

    if (logStreak >= 3) {
      items.push({
        title: `連続記録 ${logStreak}日`,
        desc: "入力習慣が定着しています",
        color: "#c084fc",
      });
    }
    if (smokeFreeDays >= 1) {
      items.push({
        title: `禁煙デー ${smokeFreeDays}日`,
        desc: "今週の禁煙達成日",
        color: "#22c55e",
      });
    }
    if (points[points.length - 1].count <= TARGET_DAILY) {
      items.push({
        title: "今日の目標内",
        desc: `目標 ${TARGET_DAILY}本をキープ`,
        color: "#5ca8e0",
      });
    }
    if (reductionTrend < 0) {
      items.push({
        title: "週間トレンド改善",
        desc: "後半3日の平均本数が減少",
        color: "#f59e0b",
      });
    }
    if (items.length === 0) {
      items.push({
        title: "記録を継続中",
        desc: "データが増えるほど分析が正確になります",
        color: "#9ca3af",
      });
    }

    return items;
  }, [logStreak, points, reductionTrend, smokeFreeDays]);

  const dailyRows = useMemo(() => points.slice().reverse(), [points]);

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>
          7日記録
        </p>
        <p className="text-sm" style={{ color: "#6b7280" }}>
          1週間の傾向を集中して確認
        </p>
      </div>

      <PeriodTabs active="week" />

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-2xl" style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}>
          <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>
            期間合計
          </p>
          <p className="text-2xl font-bold" style={{ color: "#e05c3a" }}>
            {periodTotal}
            <span className="text-sm font-normal ml-1" style={{ color: "#9ca3af" }}>
              本
            </span>
          </p>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}>
          <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>
            1日平均
          </p>
          <p className="text-2xl font-bold" style={{ color: "#f5f5f5" }}>
            {averagePerDay}
            <span className="text-sm font-normal ml-1" style={{ color: "#9ca3af" }}>
              本
            </span>
          </p>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}>
          <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>
            最多日
          </p>
          <p className="text-xl font-bold" style={{ color: "#f5f5f5" }}>
            {peakPoint.count}本
          </p>
          <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
            {peakPoint.label}
          </p>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}>
          <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>
            禁煙デー
          </p>
          <p className="text-2xl font-bold" style={{ color: smokeFreeDays > 0 ? "#22c55e" : "#f5f5f5" }}>
            {smokeFreeDays}
            <span className="text-sm font-normal ml-1" style={{ color: "#9ca3af" }}>
              日
            </span>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <TrendChart points={points} title="1週間の推移" />
      </div>

      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#9ca3af" }}>
        バッジ
      </p>
      <div className="grid gap-2 mb-8">
        {badgeItems.map((badge) => (
          <div
            key={badge.title}
            className="rounded-xl px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${badge.color}66`,
            }}
          >
            <p className="text-sm font-semibold" style={{ color: badge.color }}>
              {badge.title}
            </p>
            <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
              {badge.desc}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#9ca3af" }}>
        日別サマリー
      </p>
      <div className="space-y-3">
        {dailyRows.map((point) => {
          const ratio = Math.round((point.count / Math.max(1, peakPoint.count)) * 100);

          return (
            <div key={point.key} className="rounded-2xl p-3" style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: "#f5f5f5" }}>
                  {point.date.toLocaleDateString("ja-JP", {
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}
                </p>
                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  {point.count}本
                </p>
              </div>
              <div className="h-1.5 rounded-full mt-2" style={{ background: "#2a2a35" }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${ratio}%`, background: "rgba(224,92,58,0.8)" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
