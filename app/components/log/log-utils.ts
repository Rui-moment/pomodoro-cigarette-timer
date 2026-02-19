export type LogEntry = { timestamp: Date };

export type DailyPoint = {
  key: string;
  date: Date;
  label: string;
  count: number;
};

export type DayPartId = "morning" | "daytime" | "night" | "late-night";

export type DayPart = {
  id: DayPartId;
  label: string;
  startHour: number;
  endHour: number;
  color: string;
};

export type TodayChip = {
  key: number;
  timeLabel: string;
  intervalLabel: string;
  dayPartId: DayPartId;
  dayPartLabel: string;
  color: string;
};

export type DayTimeEntry = {
  key: number;
  timeLabel: string;
  intervalLabel: string;
};

export const DAY_PARTS: DayPart[] = [
  { id: "morning", label: "朝", startHour: 5, endHour: 11, color: "#5ca8e0" },
  { id: "daytime", label: "昼", startHour: 11, endHour: 17, color: "#f59e0b" },
  { id: "night", label: "夜", startHour: 17, endHour: 23, color: "#c084fc" },
  { id: "late-night", label: "深夜", startHour: 23, endHour: 5, color: "#6b7280" },
];

export const getDateKey = (date: Date): string => date.toISOString().split("T")[0];

export const isHourInRange = (hour: number, startHour: number, endHour: number): boolean => {
  if (startHour < endHour) {
    return hour >= startHour && hour < endHour;
  }

  return hour >= startHour || hour < endHour;
};

const getDayPart = (date: Date): DayPart => {
  return (
    DAY_PARTS.find((part) => isHourInRange(date.getHours(), part.startHour, part.endHour)) ?? DAY_PARTS[0]
  );
};

export const buildRangePoints = (
  days: number,
  dailyLogMap: Record<string, Array<{ timestamp: Date }>>,
): DailyPoint[] => {
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const offset = days - 1 - index;
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = getDateKey(date);

    return {
      key,
      date,
      label: date.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      }),
      count: dailyLogMap[key]?.length ?? 0,
    };
  });
};

export const buildTodayChips = (logs: LogEntry[]): TodayChip[] => {
  const chronological = [...logs].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return chronological
    .map((log, index): TodayChip => {
      const previous = chronological[index - 1];
      const diffMin = previous
        ? Math.round((log.timestamp.getTime() - previous.timestamp.getTime()) / 60000)
        : null;
      const dayPart = getDayPart(log.timestamp);

      return {
        key: log.timestamp.getTime(),
        timeLabel: log.timestamp.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        intervalLabel: diffMin === null ? "その日の最初" : `+${diffMin}分`,
        dayPartId: dayPart.id,
        dayPartLabel: dayPart.label,
        color: dayPart.color,
      };
    })
    .reverse();
};

export const buildDayTimeEntries = (logs: LogEntry[]): DayTimeEntry[] => {
  const descending = [...logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return descending.map((log, index) => {
    const older = descending[index + 1];
    const diffMin = older
      ? Math.round((log.timestamp.getTime() - older.timestamp.getTime()) / 60000)
      : null;

    return {
      key: log.timestamp.getTime(),
      timeLabel: log.timestamp.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      intervalLabel: diffMin === null ? "その日の最初" : `前回から ${diffMin}分`,
    };
  });
};

export const calculateLogStreak = (
  dailyLogMap: Record<string, Array<{ timestamp: Date }>>,
  maxDays = 365,
): number => {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < maxDays; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = getDateKey(date);
    const count = dailyLogMap[key]?.length ?? 0;

    if (count > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};
