// No 'use client' here, this is a Server Component

import Link from 'next/link';
import QuizClient from './QuizClient'; // Import the new client component
import path from 'path';
import fs from 'fs';

interface LessonItem {
    question: string;
    options?: string[];
    correct: string;
    type: string;
}

interface LessonData {
    lessons: LessonItem[];
}

interface Language {
    code: string;
    name: string;
    flag: string;
}

interface LessonSetMeta {
    id: string;
    title: string;
}

// generateStaticParams remains the same
export async function generateStaticParams() {
    const publicDir = path.join(process.cwd(), 'public');
    let allParams: { languageCode: string; lessonSetId: string }[] = [];
    try {
        const languagesFilePath = path.join(publicDir, 'languages.json');
        const languagesFileContent = fs.readFileSync(languagesFilePath, 'utf8');
        const languages: Language[] = JSON.parse(languagesFileContent);

        for (const lang of languages) {
            const lessonSetListFilePath = path.join(publicDir, lang.code, 'lessons.json');
            try {
                const lessonSetListFileContent = fs.readFileSync(lessonSetListFilePath, 'utf8');
                const lessonSets: LessonSetMeta[] = JSON.parse(lessonSetListFileContent);
                lessonSets.forEach(lessonSet => {
                    allParams.push({
                        languageCode: lang.code,
                        lessonSetId: lessonSet.id,
                    });
                });
            } catch (lessonError) {
                console.warn(`Could not load lesson sets for ${lang.code} during generateStaticParams:`, lessonError);
            }
        }
        return allParams;
    } catch (error) {
        console.error("Failed to generate static params for [languageCode]/[lessonSetId]:", error);
        return [];
    }
}

async function getLanguageDetails(languageCode: string): Promise<Language | null> {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const languagesFilePath = path.join(publicDir, 'languages.json');
        const languagesFileContent = fs.readFileSync(languagesFilePath, 'utf8');
        const allLanguages: Language[] = JSON.parse(languagesFileContent);
        return allLanguages.find(lang => lang.code === languageCode) || null;
    } catch (e) { return null; }
}

async function getLessonSetMeta(languageCode: string, lessonSetId: string): Promise<LessonSetMeta | null> {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const lessonSetListFilePath = path.join(publicDir, languageCode, 'lessons.json');
        const lessonSetListFileContent = fs.readFileSync(lessonSetListFilePath, 'utf8');
        const allLessonSetsMeta: LessonSetMeta[] = JSON.parse(lessonSetListFileContent);
        return allLessonSetsMeta.find(set => set.id === lessonSetId) || null;
    } catch (e) { return null; }
}

async function getLessonData(languageCode: string, lessonSetId: string): Promise<LessonData | null> {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const lessonFilePath = path.join(publicDir, languageCode, `${lessonSetId}.json`);
        const lessonFileContent = fs.readFileSync(lessonFilePath, 'utf8');
        return JSON.parse(lessonFileContent);
    } catch (e) { return null; }
}

interface PageProps {
    params: {
        languageCode: string;
        lessonSetId: string;
    };
}

export default async function QuizPage({ params }: PageProps) {
    const { languageCode, lessonSetId } = params;

    // Fetch all data on the server
    const languageDetails = await getLanguageDetails(languageCode);
    const lessonSetMeta = await getLessonSetMeta(languageCode, lessonSetId);
    const lessonData = await getLessonData(languageCode, lessonSetId);

    // Handle cases where essential data might not be found
    if (!languageDetails || !lessonSetMeta || !lessonData) {
        let errorReason = "Could not load lesson content.";
        if (!languageDetails) errorReason = `Language details for "${languageCode}" not found.`;
        else if (!lessonSetMeta) errorReason = `Lesson set metadata for "${lessonSetId}" in ${languageCode} not found.`;
        else if (!lessonData) errorReason = `Lesson data for "${languageCode}/${lessonSetId}" not found.`;
        
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-600">Error Loading Lesson</h2>
                <p className="text-gray-600 mt-2">{errorReason}</p>
                <Link href={`/${languageCode}`} className="mt-6 inline-block text-blue-500 hover:text-blue-600 font-medium">
                    ← Back to Lesson Selection ({languageCode})
                </Link>
            </div>
        );
    }

    return (
        <QuizClient 
            initialLanguageDetails={languageDetails}
            initialLessonSetMeta={lessonSetMeta}
            initialLessonData={lessonData}
            languageCode={languageCode}
            lessonSetId={lessonSetId}
        />
    );
} 
