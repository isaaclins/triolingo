'use client';

import Link from 'next/link';
import { useGlobalState } from '@/app/context/GlobalStateContext';
import { useScore } from '@/app/context/ScoreContext';
import { useParams } from 'next/navigation';

export default function Header() {
    const { hearts, streak } = useGlobalState();
    const { getScore } = useScore();
    const params = useParams();
    const languageCode = Array.isArray(params.languageCode) ? params.languageCode[0] : params.languageCode as string | undefined;

    let currentLanguageScore = null;
    if (languageCode) {
        currentLanguageScore = getScore(languageCode);
    }

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
                        <span className="text-orange-500">Streak: 🔥</span>
                        <span className="font-bold text-gray-700">{streak}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-red-500">Hearts: ❤️</span>
                        <span className="font-bold text-gray-700">{hearts}</span>
                    </div>
                    {currentLanguageScore ? (
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-700">
                                Correct: {currentLanguageScore.correct}, Incorrect: {currentLanguageScore.incorrect}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            {/* <span className="text-yellow-500"> Score: ⭐</span> */}
                            {/* <span className="font-bold text-gray-700">{useGlobalState().score}</span> */}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
} 
