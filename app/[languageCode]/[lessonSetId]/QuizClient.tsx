'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '@/app/context/GlobalStateContext';
import { useScore } from '@/app/context/ScoreContext';

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

interface QuizClientProps {
    initialLessonData: LessonData | null;
    initialLanguageDetails: Language | null;
    initialLessonSetMeta: LessonSetMeta | null;
    languageCode: string; // Passed for navigation
    lessonSetId: string; // Passed for context, though data is pre-fetched
}

// Helper function to parse the question string for hoverable words
const parseQuestionString = (question: string): (string | JSX.Element)[] => {
    const parts = [];
    let lastIndex = 0;
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g; // Matches [word](definition)
    let match;

    while ((match = regex.exec(question)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            parts.push(question.substring(lastIndex, match.index));
        }
        // Add the hoverable word
        const word = match[1];
        const definition = match[2];
        parts.push(
            <span 
                key={`${word}-${match.index}`} 
                className="hoverable-word"
                data-definition={definition}
            >
                {word}
            </span>
        );
        lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last match
    if (lastIndex < question.length) {
        parts.push(question.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : [question]; // Return original string if no matches
};

export default function QuizClient({
    initialLessonData,
    initialLanguageDetails,
    initialLessonSetMeta,
    languageCode,
}: QuizClientProps) {
    const router = useRouter();
    const { incrementCorrect, incrementIncorrect } = useScore();

    // Initialize state from props passed by the Server Component
    const [lessonData, setLessonData] = useState<LessonData | null>(initialLessonData);
    const [currentLanguageDetails, setCurrentLanguageDetails] = useState<Language | null>(initialLanguageDetails);
    const [currentLessonSetMeta, setCurrentLessonSetMeta] = useState<LessonSetMeta | null>(initialLessonSetMeta);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [userInput, setUserInput] = useState('');

    // No useEffect for initial data fetching, as it's done by the Server Component

    const currentLessonItem = lessonData?.lessons[currentQuestionIndex];
    // Progress calculation needs to handle lessonData potentially being null initially, though props should provide it
    const progressPercentage = lessonData && lessonData.lessons.length > 0
        ? ((currentQuestionIndex + 1) / lessonData.lessons.length) * 100
        : 0;

    const handleAnswerSelect = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
        if (currentLessonItem?.type !== 'fill-blank') {
            setUserInput(answer);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (showResult) return;
        setUserInput(event.target.value);
        setSelectedAnswer(event.target.value);
    };

    const handleSubmit = () => {
        if (!currentLessonItem) return;
        let answerToCheck = (currentLessonItem.type === 'fill-blank' ? userInput.trim() : selectedAnswer);
        const correct = answerToCheck.toLowerCase() === currentLessonItem.correct.toLowerCase();
        
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            incrementCorrect(languageCode);
        } else {
            incrementIncorrect(languageCode);
        }
    };

    const handleNext = () => {
        setShowResult(false);
        setSelectedAnswer('');
        setUserInput('');
        if (lessonData && currentQuestionIndex < lessonData.lessons.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            router.push(`/${languageCode}`); // Back to lesson set selection
        }
    };

    // Error and initial loading states are handled by the parent Server Component.
    // This client component assumes valid initial data or null if an error occurred higher up.
    if (!lessonData || !currentLessonItem || !currentLanguageDetails || !currentLessonSetMeta) {
        // This case should ideally be caught by the Server Component before rendering this client part
        // Or display a more specific error/loading state if this component also handles some internal loading
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-4xl mb-4">🤔</div>
                <h2 className="text-2xl font-bold text-gray-700">Lesson content is unavailable.</h2>
                <Link href={`/${languageCode}`} className="mt-6 inline-block text-blue-500 hover:text-blue-600 font-medium">
                    ← Back to Lesson Selection
                </Link>
            </div>
        );
    }

    const parsedQuestion = parseQuestionString(currentLessonItem.question);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{currentLessonSetMeta.title}</span>
                    <span>Question {currentQuestionIndex + 1} of {lessonData.lessons.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-green-500 rounded-full transition-all duration-300 ease-out h-3"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            {!showResult ? (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <Link href={`/${languageCode}`} className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                            ← Back to Lessons ({currentLanguageDetails.name})
                        </Link>
                        <div className="flex items-center space-x-2">
                            <span className="text-xl">{currentLanguageDetails.flag}</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center min-h-[60px]">
                        {parsedQuestion.map((part, index) => (
                            <Fragment key={index}>{part}</Fragment>
                        ))}
                    </h2>
                    {currentLessonItem.type === 'multiple-choice' && currentLessonItem.options && (
                        <div className="space-y-3">
                            {currentLessonItem.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={showResult}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed
                                        ${
                                            selectedAnswer === option && !showResult
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-400'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }
                                        ${
                                            showResult && option === currentLessonItem.correct
                                                ? 'border-green-500 bg-green-50 text-green-700 font-semibold' 
                                                : ''
                                        }
                                        ${
                                            showResult && selectedAnswer === option && option !== currentLessonItem.correct 
                                                ? 'border-red-500 bg-red-50 text-red-700' 
                                                : ''
                                        }
                                    `}
                                >
                                    <span className="text-lg font-medium">{option}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {currentLessonItem.type === 'fill-blank' && (
                        <div className="mt-4">
                            <input 
                                type="text"
                                value={userInput}
                                onChange={handleInputChange}
                                disabled={showResult}
                                placeholder="Type your answer here..."
                                className="w-full p-4 text-lg rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 outline-none transition-colors disabled:opacity-75 disabled:bg-gray-50"
                            />
                        </div>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAnswer || showResult}
                        className={`w-full mt-8 py-3.5 rounded-xl font-bold text-lg transition-all duration-200 text-white
                            ${
                                !selectedAnswer || showResult
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600'
                            }
                        `}
                    >
                        CHECK
                    </button>
                </>
            ) : (
                <div className="text-center py-8">
                    <div className={`text-7xl mb-5 ${isCorrect ? 'animate-bounce' : 'animate-shake'}`}>
                        {isCorrect ? '🎉' : '😞'}
                    </div>
                    <h2 className={`text-3xl font-bold mb-3 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                    </h2>
                    {!isCorrect && (
                        <p className="text-gray-700 text-lg mb-1">
                            Correct answer:{' '}
                            <span className="font-bold text-green-600">{currentLessonItem.correct}</span>
                        </p>
                    )}
                    {isCorrect && <p className="text-gray-700 text-lg mb-6">+10 XP earned!</p>}
                    <button
                        onClick={handleNext}
                        className="w-full max-w-xs mx-auto mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    >
                        {currentQuestionIndex < lessonData.lessons.length - 1 ? 'CONTINUE' : 'COMPLETE LESSON'}
                    </button>
                </div>
            )}
        </div>
    );
} 
