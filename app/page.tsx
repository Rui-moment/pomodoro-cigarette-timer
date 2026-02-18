"use client";
import Link from "next/link";
import { useCigaretteLog } from "@/hooks/useCigaretteLog";

export default function Home() {
  const { logs, savings } = useCigaretteLog();
  const TARGET = 20; // TODO: 後で設定から取得

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">🍅禁煙ポモドーロ🍅</h1>
      
      {/* 今日の本数 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-xl mb-8">
        <p className="text-sm opacity-90">今日の本数</p>
        <p className="text-6xl font-bold my-4">{logs.length}</p>
        <p className="text-sm opacity-90">目標: {TARGET}本</p>
        {logs.length <= TARGET && (
          <p className="text-sm mt-2">✨ 目標達成中！</p>
        )}
      </div>

      {/* 節約額 */}
      <div className="bg-gray-100 p-6 rounded-xl mb-8">
        <p className="text-sm text-gray-600">今日の節約額</p>
        <p className="text-3xl font-bold text-green-600">
          {savings >= 0 ? `${savings}円` : `${Math.abs(savings)}円オーバー`}
        </p>
      </div>

      {/* ナビゲーション */}
      <div className="grid grid-cols-2 gap-4">
        <Link 
          href="/timer"
          className="bg-blue-500 text-white p-6 rounded-xl text-center hover:bg-blue-600"
        >
          <p className="text-3xl mb-2">🍅</p>
          <p className="font-bold">タイマー</p>
        </Link>
        
        <Link 
          href="/log"
          className="bg-purple-500 text-white p-6 rounded-xl text-center hover:bg-purple-600"
        >
          <p className="text-3xl mb-2">📊</p>
          <p className="font-bold">記録</p>
        </Link>
      </div>
    </main>
  );
}