'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Corrected import for App Router

interface Language {
    code: string;
    name: string;
    flag: string;
}

export default function LanguageSelectionPage() {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setLoading(true);
                const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
                const response = await fetch(`${basePath}/languages.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load languages.json: ${response.statusText}`);
                }
                const data: Language[] = await response.json();
                setLanguages(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching languages:', err);
                setError(err.message || 'Could not fetch languages.');
                setLanguages([]); // Clear languages on error
            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    const handleLanguageSelect = (languageCode: string) => {
        router.push(`/${languageCode}`);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h2 className="text-2xl font-bold text-gray-800">Loading Languages...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-600">Error Loading Languages</h2>
                <p className="text-gray-600 mt-2">{error}</p>
                <p className="text-gray-500 mt-1">Please ensure `public/languages.json` exists and is correctly formatted.</p>
            </div>
        );
    }

    if (languages.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-4xl mb-4">🤔</div>
                <h2 className="text-2xl font-bold text-gray-800">No Languages Available</h2>
                <p className="text-gray-600 mt-2">Please add languages to `public/languages.json`.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Select a Language to Learn
                </h2>
                <p className="text-gray-600">
                    Choose which language you'd like to practice today.
                </p>
            </div>
            <div className="space-y-4">
                {languages.map((language) => (
                    <button
                        key={language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                        className="w-full p-6 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl">{language.flag}</span>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                                        {language.name}
                                    </h3>
                                </div>
                            </div>
                            <div className="text-blue-500 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                →
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
