"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const tabs: Array<{ label: string; href: string }> = [
  { label: "今日", href: "/log" },
  { label: "7日", href: "/log/week" },
  { label: "1ヶ月", href: "/log/month" },
];

let lastActiveIndex = 0;

export default function PeriodTabs() {
  const pathname = usePathname();
  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((tab) => pathname === tab.href)),
    [pathname],
  );
  const [pillIndex, setPillIndex] = useState(lastActiveIndex);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setPillIndex(activeIndex);
      lastActiveIndex = activeIndex;
    });
    return () => cancelAnimationFrame(rafId);
  }, [activeIndex]);

  return (
    <div
      className="nav-shell relative mb-6 grid grid-cols-3 items-stretch rounded-2xl p-1"
      style={{
        backdropFilter: "blur(14px) saturate(125%)",
        WebkitBackdropFilter: "blur(14px) saturate(125%)",
      }}
    >
      <span
        aria-hidden
        className="nav-pill pointer-events-none absolute left-1 top-1 bottom-1 w-1/3 rounded-xl"
        style={{
          transform: `translateX(${pillIndex * 100}%)`,
        }}
      />
      {tabs.map((tab) => {
        const active = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            data-active={active}
            aria-current={active ? "page" : undefined}
            className={`nav-item relative z-10 rounded-xl py-2.5 text-sm text-center transition-all ${
              active
                ? "text-zinc-50 translate-y-[-1px]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
