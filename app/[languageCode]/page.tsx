// No 'use client' here, this is a Server Component

import Link from 'next/link';
import LessonSetListClient from './LessonSetListClient'; // Import the new client component
import path from 'path';
import fs from 'fs';

interface LessonSet {
    id: string;
    title: string;
}

interface Language {
    code: string;
    name: string;
    flag: string;
}

// Function to generate static paths for language codes
// This function must be defined at the top level of the module, not inside the component.
export async function generateStaticParams() {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const languagesFilePath = path.join(publicDir, 'languages.json');
        const languagesFileContent = fs.readFileSync(languagesFilePath, 'utf8');
        const languagesData: Language[] = JSON.parse(languagesFileContent);

        return languagesData.map((lang) => ({
            languageCode: lang.code,
        }));
    } catch (error) {
        console.error("Failed to generate static params for [languageCode]:", error);
        // In case of error, return an empty array to prevent build failure,
        // or handle as appropriate (e.g., throw to fail the build if languages.json is critical)
        return []; 
    }
}

async function getLanguageDetails(languageCode: string): Promise<Language | null> {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const languagesFilePath = path.join(publicDir, 'languages.json');
        const languagesFileContent = fs.readFileSync(languagesFilePath, 'utf8');
        const allLanguages: Language[] = JSON.parse(languagesFileContent);
        const foundLanguage = allLanguages.find(lang => lang.code === languageCode);
        return foundLanguage || null;
    } catch (error) {
        console.error(`Error fetching language details for ${languageCode}:`, error);
        return null;
    }
}

async function getLessonSets(languageCode: string): Promise<LessonSet[]> {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const lessonSetListFilePath = path.join(publicDir, languageCode, 'lessons.json');
        const lessonSetListFileContent = fs.readFileSync(lessonSetListFilePath, 'utf8');
        return JSON.parse(lessonSetListFileContent);
    } catch (error) {
        console.error(`Error fetching lesson sets for ${languageCode}:`, error);
        return []; // Return empty array if lessons.json is missing or unreadable
    }
}

interface PageProps {
    params: {
        languageCode: string;
    };
}

// This is now an async Server Component
export default async function LessonSetSelectionPage({ params }: PageProps) {
    const { languageCode } = params;

    // Fetch data directly on the server
    const languageDetails = await getLanguageDetails(languageCode);
    const lessonSets = await getLessonSets(languageCode);

    // Handle cases where data might not be found (though generateStaticParams should prevent invalid codes)
    if (!languageDetails) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-4xl mb-4">❓</div>
                <h2 className="text-2xl font-bold text-gray-800">Language Not Found</h2>
                <p className="text-gray-600 mt-2">
                    The language "{languageCode}" could not be found.
                </p>
                <Link href="/" className="mt-6 inline-block text-blue-500 hover:text-blue-600 font-medium">
                    ← Back to Language Selection
                </Link>
            </div>
        );
    }

    // Pass the fetched data to the Client Component
    return (
        <LessonSetListClient 
            languageDetails={languageDetails} 
            lessonSets={lessonSets} 
            languageCode={languageCode} 
        />
    );
} 
