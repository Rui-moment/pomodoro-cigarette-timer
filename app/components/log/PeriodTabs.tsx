"use client";
import Link from "next/link";

type PeriodView = "today" | "week" | "month";

const tabs: Array<{ id: PeriodView; label: string; href: string }> = [
  { id: "today", label: "今日", href: "/log" },
  { id: "week", label: "7日", href: "/log/week" },
  { id: "month", label: "30日", href: "/log/month" },
];

export default function PeriodTabs({ active }: { active: PeriodView }) {
  return (
    <div
      className="mb-6 grid grid-cols-3 gap-2 rounded-2xl p-1"
      style={{ background: "#1a1a1f", border: "1px solid #2a2a35" }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className="rounded-xl py-2 text-sm text-center transition-all duration-200"
            style={{
              background: isActive ? "rgba(224,92,58,0.2)" : "transparent",
              border: isActive ? "1px solid rgba(224,92,58,0.7)" : "1px solid transparent",
              color: isActive ? "#f5f5f5" : "#9ca3af",
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
