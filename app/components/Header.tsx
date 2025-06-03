'use client';

import Link from 'next/link';
import { useGlobalState } from '@/app/context/GlobalStateContext';

export default function Header() {
    const { score, hearts, streak } = useGlobalState();

    return (
        <header className="bg-white shadow-lg">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl rounded-[23px] w-[18px] h-[31px]">
                            🦉
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">TrioLingo</h1>
                </Link>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-orange-500">🔥</span>
                        <span className="font-bold text-gray-700">{streak}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-red-500">❤️</span>
                        <span className="font-bold text-gray-700">{hearts}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-bold text-gray-700">{score}</span>
                    </div>
                </div>
            </div>
        </header>
    );
} 
