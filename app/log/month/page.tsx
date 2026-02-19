"use client";
import { useMemo } from "react";
import PeriodTabs from "@/app/components/log/PeriodTabs";
import {
  getDateKey,
} from "@/app/components/log/log-utils";
import { useTimer } from "../../providers/TImerProvider ";

const WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

type CalendarCell = {
  key: string;
  day: number;
  count: number;
  inMonthRange: boolean;
};

export default function MonthLogPage() {
  const { dailyLogMap } = useTimer();
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthPoints = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      const key = getDateKey(date);
      const inMonthRange = date <= today;

      return {
        key,
        date,
        day,
        count: inMonthRange ? (dailyLogMap[key]?.length ?? 0) : 0,
        inMonthRange,
      };
    });
  }, [currentMonth, currentYear, dailyLogMap, daysInMonth, today]);

  const elapsedPoints = useMemo(
    () => monthPoints.filter((point) => point.inMonthRange),
    [monthPoints],
  );

  const periodTotal = useMemo(
    () => elapsedPoints.reduce((sum, point) => sum + point.count, 0),
    [elapsedPoints],
  );
  const daysWithLogs = useMemo(
    () => elapsedPoints.filter((point) => point.count > 0).length,
    [elapsedPoints],
  );
  const smokeFreeDays = elapsedPoints.length - daysWithLogs;
  const averagePerDay = elapsedPoints.length > 0
    ? (periodTotal / elapsedPoints.length).toFixed(1)
    : "0.0";
  const maxCount = Math.max(1, ...elapsedPoints.map((point) => point.count));
  const peakPoint = useMemo(
    () => elapsedPoints.reduce((max, point) => (point.count > max.count ? point : max), elapsedPoints[0]),
    [elapsedPoints],
  );

  const calendarCells = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const leadingEmpty: Array<CalendarCell | null> = Array.from(
      { length: firstDay.getDay() },
      () => null,
    );

    const dateCells: CalendarCell[] = monthPoints.map((point) => ({
      key: point.key,
      day: point.day,
      count: point.count,
      inMonthRange: point.inMonthRange,
    }));

    const cells: Array<CalendarCell | null> = [...leadingEmpty, ...dateCells];
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    return cells;
  }, [currentMonth, currentYear, monthPoints]);

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>
          1ヶ月記録
        </p>
        <p className="text-sm" style={{ color: "#6b7280" }}>
          当月の推移をまとめて確認
        </p>
      </div>

      <PeriodTabs />

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
            {peakPoint.date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
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
        <div className="mb-3">
          <p className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
            当月カレンダー
          </p>
        </div>
        <p className="text-sm font-semibold mb-2" style={{ color: "#f5f5f5" }}>
          {new Date(currentYear, currentMonth, 1).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
          })}
        </p>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEK_LABELS.map((label) => (
            <div key={label} className="text-center text-[10px]" style={{ color: "#6b7280" }}>
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell, index) => {
            if (cell === null) {
              return <div key={`empty-${index}`} className="h-11 rounded-md" />;
            }

            const intensity = cell.count === 0
              ? 0.08
              : Math.min(0.92, 0.2 + (cell.count / maxCount) * 0.72);

            return (
              <div
                key={cell.key}
                className="h-11 rounded-md px-1 py-1 flex flex-col justify-between"
                style={{
                  background: cell.inMonthRange
                    ? `rgba(224,92,58,${intensity})`
                    : "rgba(255,255,255,0.03)",
                  border: cell.inMonthRange
                    ? (cell.count > 0
                      ? "1px solid rgba(224,92,58,0.6)"
                      : "1px solid rgba(255,255,255,0.09)")
                    : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] text-center" style={{ color: cell.inMonthRange ? "#f5f5f5" : "#6b7280" }}>
                  {cell.day}
                </p>
                <p className="text-[10px] font-semibold text-center" style={{ color: cell.inMonthRange ? "#f5f5f5" : "#6b7280" }}>
                  {cell.inMonthRange ? cell.count : ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
