"use client";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    deserialize?: (value: string) => T
) {
    const  [value, setValue] = useState(() => {
        //サーバーサイドチェック
        if (typeof window === 'undefined') {
            return initialValue;
        }
        const savedValue = localStorage.getItem(key);
        if (savedValue !== null) {
            return deserialize 
            ? deserialize(savedValue) 
            : JSON.parse(savedValue);
        } else {
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}