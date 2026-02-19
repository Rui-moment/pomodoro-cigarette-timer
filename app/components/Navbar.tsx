"use client";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: '/', icon: '🏠', label: 'ホーム' },
    { href: '/timer', icon: '🍅', label: 'タイマー' },
    { href: '/log', icon: '📊', label: '記録' },
];

export default function Navbar() {
    const pathname = usePathname();
    const iconRefs = useRef<Map<string, HTMLSpanElement | null>>(new Map());
    const isActive = (path: string) => pathname === path;

    const handleClick = (href: string) => {
        const el = iconRefs.current.get(href);
        if (!el) return;
        el.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(0.75)', offset: 0.3 },
                { transform: 'scale(1.2)',  offset: 0.6 },
                { transform: 'scale(0.93)', offset: 0.8 },
                { transform: 'scale(1)' },
            ],
            { duration: 420, easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)' },
        );
    };

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                background: 'rgba(26,26,31,0.9)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            <div className="max-w-md mx-auto px-4 py-2 flex justify-around">
                {navItems.map(({ href, icon, label }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={() => handleClick(href)}
                        className={`flex flex-col items-center py-2 px-6 relative transition-colors ${
                            isActive(href) ? 'text-white' : 'text-zinc-500'
                        }`}
                    >
                        {/* アニメーション対象を内側 span に分離 → Link のナビゲーションと競合しない */}
                        <span
                            ref={(el) => { iconRefs.current.set(href, el); }}
                            className="flex flex-col items-center gap-1"
                        >
                            <span className="text-2xl">{icon}</span>
                            <span className="text-xs">{label}</span>
                        </span>
                        {isActive(href) && (
                            <span
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                                style={{ background: '#e05c3a' }}
                            />
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
