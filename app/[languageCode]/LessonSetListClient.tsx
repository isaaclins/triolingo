'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LessonSet {
    id: string;
    title: string;
}

interface Language {
    code: string;
    name: string;
    flag: string;
}

interface LessonSetListClientProps {
    languageDetails: Language | null;
    lessonSets: LessonSet[];
    languageCode: string;
}

export default function LessonSetListClient({
    languageDetails,
    lessonSets,
    languageCode,
}: LessonSetListClientProps) {
    const router = useRouter();

    const handleLessonSetSelect = (lessonSetId: string) => {
        router.push(`/${languageCode}/${lessonSetId}`);
    };

    // Loading and error states will be handled by the parent Server Component
    if (!languageDetails) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-4xl mb-4">❓</div>
                <h2 className="text-2xl font-bold text-gray-800">Language Not Found</h2>
                <p className="text-gray-600 mt-2">Details for the selected language could not be loaded.</p>
                <Link href="/" className="mt-6 inline-block text-blue-500 hover:text-blue-600 font-medium">
                    ← Back to Language Selection
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
                <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium">
                    ← Back to Languages
                </Link>
                <div className="flex items-center space-x-2">
                    <span className="text-3xl">{languageDetails.flag}</span>
                    <h2 className="text-2xl font-bold text-gray-700">
                        {languageDetails.name} Lessons
                    </h2>
                </div>
                <div></div> {/* Empty div for spacing */}
            </div>
            
            <p className="text-center text-gray-600 mb-8">
                Choose a lesson set to start practicing {languageDetails.name}.
            </p>

            {lessonSets.length === 0 && (
                 <div className="text-center text-gray-500 py-6">
                    <p>No lesson sets found for {languageDetails.name}.</p>
                    <p>Please add lesson configurations to `public/{languageCode}/lessons.json`.</p>
                </div>
            )}

            <div className="space-y-4">
                {lessonSets.map((lessonSet) => (
                    <button
                        key={lessonSet.id}
                        onClick={() => handleLessonSetSelect(lessonSet.id)}
                        className="w-full p-6 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                                    {lessonSet.title}
                                </h3>
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
