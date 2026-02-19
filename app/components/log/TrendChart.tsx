import { DailyPoint } from "./log-utils";

export default function TrendChart({
  points,
  title,
}: {
  points: DailyPoint[];
  title: string;
}) {
  const width = 348;
  const height = 220;
  const paddingLeft = 36;
  const paddingRight = 14;
  const paddingTop = 20;
  const paddingBottom = 44;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxCount = Math.max(1, ...points.map((point) => point.count));
  const barWidth = chartWidth / points.length - 7.5;
  const yTicks = Array.from(new Set([0, Math.ceil(maxCount / 2), maxCount])).sort((a, b) => a - b);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background:
          "radial-gradient(130% 110% at 0% 0%, rgba(92,168,224,0.16) 0%, rgba(92,168,224,0.02) 42%, rgba(0,0,0,0) 100%), #1a1a1f",
        border: "1px solid #2a2a35",
      }}
    >
      <div className="mb-3 flex items-end justify-between">
        <p className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
          {title}
        </p>
        <p className="text-xs" style={{ color: "#6b7280" }}>
          横: 日付 / 縦: 本数
        </p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {yTicks.map((tick) => {
          const y = paddingTop + chartHeight - (tick / maxCount) * chartHeight;
          return (
            <g key={tick}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#2a2a35" strokeWidth="1" />
              <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#6b7280">
                {tick}
              </text>
            </g>
          );
        })}

        {points.map((point, index) => {
          const barX = paddingLeft + index * (chartWidth / points.length) + 3.5;
          const barHeight = (point.count / maxCount) * chartHeight;
          const barY = paddingTop + chartHeight - barHeight;

          return (
            <g key={point.key}>
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={Math.max(2, barHeight)}
                rx="6"
                fill="rgba(224,92,58,0.72)"
                stroke="rgba(224,92,58,0.95)"
              />
              <text x={barX + barWidth / 2} y={barY - 6} textAnchor="middle" fontSize="10" fill="#f5f5f5">
                {point.count}
              </text>
              <text
                x={barX + barWidth / 2}
                y={height - 16}
                textAnchor="middle"
                fontSize="10"
                fill="#9ca3af"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
