"use client";
import { useMemo } from "react";
import PeriodTabs from "@/app/components/log/PeriodTabs";
import {
  buildRangePoints,
  getDateKey,
} from "@/app/components/log/log-utils";
import { useTimer } from "../../providers/TImerProvider ";

const WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

type CalendarCell = {
  key: string;
  day: number;
  count: number;
  inRange: boolean;
};

type CalendarMonth = {
  key: string;
  title: string;
  cells: Array<CalendarCell | null>;
};

export default function MonthLogPage() {
  const { dailyLogMap } = useTimer();

  const points = useMemo(() => buildRangePoints(30, dailyLogMap), [dailyLogMap]);
  const periodTotal = useMemo(() => points.reduce((sum, point) => sum + point.count, 0), [points]);
  const daysWithLogs = useMemo(() => points.filter((point) => point.count > 0).length, [points]);
  const smokeFreeDays = 30 - daysWithLogs;
  const averagePerDay = (periodTotal / 30).toFixed(1);
  const maxCount = Math.max(1, ...points.map((point) => point.count));
  const peakPoint = useMemo(
    () => points.reduce((max, point) => (point.count > max.count ? point : max), points[0]),
    [points],
  );

  const calendarMonths = useMemo(() => {
    if (points.length === 0) {
      return [];
    }

    const countMap = new Map(points.map((point) => [point.key, point.count]));
    const rangeStart = new Date(points[0].date);
    rangeStart.setHours(0, 0, 0, 0);
    const rangeEnd = new Date(points[points.length - 1].date);
    rangeEnd.setHours(0, 0, 0, 0);

    const startMonth = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
    const endMonth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);
    const months: CalendarMonth[] = [];

    for (
      const cursor = new Date(startMonth);
      cursor <= endMonth;
      cursor.setMonth(cursor.getMonth() + 1)
    ) {
      const year = cursor.getFullYear();
      const month = cursor.getMonth();
      const firstDay = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const cells: Array<CalendarCell | null> = Array.from({ length: firstDay.getDay() }, () => null);

      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        const key = getDateKey(date);
        const inRange = date >= rangeStart && date <= rangeEnd;

        cells.push({
          key,
          day,
          count: inRange ? (countMap.get(key) ?? 0) : 0,
          inRange,
        });
      }

      while (cells.length % 7 !== 0) {
        cells.push(null);
      }

      months.push({
        key: `${year}-${month}`,
        title: firstDay.toLocaleDateString("ja-JP", { year: "numeric", month: "long" }),
        cells,
      });
    }

    return months;
  }, [points]);

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>
          30日記録
        </p>
        <p className="text-sm" style={{ color: "#6b7280" }}>
          月間の増減をまとめて確認
        </p>
      </div>

      <PeriodTabs active="month" />

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

      <div className="rounded-2xl p-4 mb-6" style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}>
        <div className="mb-3 flex items-end justify-between">
          <p className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
            30日カレンダー
          </p>
          <p className="text-xs" style={{ color: "#6b7280" }}>
            月ごとに表示 / 濃いほど本数が多い
          </p>
        </div>
        <div className="space-y-4">
          {calendarMonths.map((month) => (
            <div key={month.key}>
              <p className="text-sm font-semibold mb-2" style={{ color: "#f5f5f5" }}>
                {month.title}
              </p>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEK_LABELS.map((label) => (
                  <div key={label} className="text-center text-[10px]" style={{ color: "#6b7280" }}>
                    {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {month.cells.map((cell, index) => {
                  if (cell === null) {
                    return <div key={`${month.key}-empty-${index}`} className="h-11 rounded-md" />;
                  }

                  const intensity = cell.count === 0
                    ? 0.08
                    : Math.min(0.92, 0.2 + (cell.count / maxCount) * 0.72);

                  return (
                    <div
                      key={`${month.key}-${cell.key}`}
                      className="h-11 rounded-md px-1 py-1 flex flex-col justify-between"
                      style={{
                        background: cell.inRange
                          ? `rgba(224,92,58,${intensity})`
                          : "rgba(255,255,255,0.03)",
                        border: cell.inRange
                          ? (cell.count > 0
                            ? "1px solid rgba(224,92,58,0.6)"
                            : "1px solid rgba(255,255,255,0.09)")
                          : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p className="text-[10px] text-center" style={{ color: cell.inRange ? "#f5f5f5" : "#6b7280" }}>
                        {cell.day}
                      </p>
                      <p className="text-[10px] font-semibold text-center" style={{ color: cell.inRange ? "#f5f5f5" : "#6b7280" }}>
                        {cell.inRange ? cell.count : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
