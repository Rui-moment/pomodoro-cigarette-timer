"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon({ active }: { active: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={active ? 2.15 : 1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="nav-glyph h-5 w-5"
            aria-hidden
        >
            <path d="M3.75 10.75L12 4l8.25 6.75" />
            <path d="M6.75 9.8v9.45h10.5V9.8" />
            <path d="M10 19.25v-4.5h4v4.5" />
        </svg>
    );
}

function TimerIcon({ active }: { active: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={active ? 2.15 : 1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="nav-glyph h-5 w-5"
            aria-hidden
        >
            <circle cx="12" cy="13" r="6.5" />
            <path d="M12 13l2.8-1.9" />
            <path d="M9.5 4h5" />
            <path d="M12 6.5V4" />
            <path d="M17.35 7.65l1.85-1.85" />
        </svg>
    );
}

function StatsIcon({ active }: { active: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={active ? 2.15 : 1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="nav-glyph h-5 w-5"
            aria-hidden
        >
            <path d="M5 18.5h14" />
            <path d="M8 18.5V12.5" />
            <path d="M12 18.5V9.5" />
            <path d="M16 18.5V14" />
            <path d="M19 18.5V7.5" />
        </svg>
    );
}

const navItems = [
    { href: '/', Icon: HomeIcon, label: 'ホーム' },
    { href: '/timer', Icon: TimerIcon, label: 'タイマー' },
    { href: '/log', Icon: StatsIcon, label: '記録' },
];

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }
        return pathname === path || pathname.startsWith(`${path}/`);
    };
    const activeIndex = Math.max(0, navItems.findIndex((item) => isActive(item.href)));

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2"
            style={{
                background:
                    'linear-gradient(180deg, rgba(13,13,15,0.08) 0%, rgba(13,13,15,0.62) 48%, rgba(13,13,15,0.9) 100%)',
            }}
        >
            <div
                className="nav-shell max-w-md mx-auto grid grid-cols-3 items-stretch relative rounded-3xl p-1"
                style={{
                    backdropFilter: 'blur(18px) saturate(130%)',
                    WebkitBackdropFilter: 'blur(18px) saturate(130%)',
                }}
            >
                <span
                    aria-hidden
                    className="nav-pill pointer-events-none absolute left-1 top-1 bottom-1 w-1/3 rounded-[1.15rem]"
                    style={{
                        transform: `translateX(${activeIndex * 100}%)`,
                    }}
                />
                {navItems.map(({ href, Icon, label }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            data-active={active}
                            className={`relative z-10 flex flex-col items-center justify-center gap-1 py-2.5 px-3 rounded-2xl nav-item transition-all ${
                                active
                                    ? 'text-zinc-50 translate-y-[-1px]'
                                    : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                        >
                            <span
                                className={`leading-none transition-transform duration-500 ${
                                    active ? 'scale-[1.06]' : ''
                                }`}
                            >
                                <Icon active={active} />
                            </span>
                            <span
                                className={`text-[0.7rem] tracking-[0.02em] transition-opacity duration-300 ${
                                    active ? 'opacity-100' : 'opacity-90'
                                }`}
                            >
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
