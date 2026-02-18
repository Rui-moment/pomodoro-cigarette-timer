"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-white border-b sticky top-0 z-10">
            <div className="max-w-md mx-auto px-4 py-3 flex justify-around">
                <Link
                  href="/"
                  className={`flex flex-col items-center ${isActive('/') ? 'text-orange-500' : 'text-gray-500'}`}
                >
                  <span className="text-2xl">🏠</span>
                  <span className="text-xs">ホーム</span>
                </Link>

                <Link
                  href="/timer"
                  className={`flex flex-col items-center ${isActive('/timer') ? 'text-orange-500' : 'text-gray-500'}`}
                >
                  <span className="text-2xl">🍅</span>
                  <span className="text-xs">タイマー</span>
                </Link>

                <Link
                  href="/log"
                  className={`flex flex-col items-center ${isActive('/log') ? 'text-orange-500' : 'text-gray-500'}`}
                >
                  <span className="text-2xl">📊</span>
                  <span className="text-xs">記録</span>
                </Link>
            </div>
        </nav>
    );
}