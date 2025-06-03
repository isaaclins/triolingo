'use client';

import { useState, useEffect } from 'react';

interface Lesson {
    question: string;
    options: string[];
    correct: string;
    type: string;
}

interface LessonSet {
    title: string;
    lessons: Lesson[];
}

interface Language {
    code: string;
    name: string;
    flag: string;
}

// Helper component to auto-select language and trigger re-render
function AutoSelectLanguageComponent({
    lang,
    onSelected,
}: {
    lang: string;
    onSelected: (langCode: string) => void;
}) {
    useEffect(() => {
        onSelected(lang);
    }, [lang, onSelected]);
    return (
        <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-800">Loading language...</h2>
        </div>
    );
}

export default function Page() {
    const [currentLesson, setCurrentLesson] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(3);
    const [hearts, setHearts] = useState(5);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedLessonSet, setSelectedLessonSet] = useState<string | null>(null);
    const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
    const [lessonData, setLessonData] = useState<LessonSet | null>(null);
    const [availableLessons, setAvailableLessons] = useState<{ id: string; title: string }[]>([]);
    const [loading, setLoading] = useState(false);

    // Available languages
    const availableLanguages: Language[] = [
        { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
        { code: 'polish', name: 'Polish', flag: '🇵🇱' },
    ];

    // Load available lesson sets on component mount
    useEffect(() => {
        const loadAvailableLessons = async () => {
            try {
                // For now, we'll hardcode the available lessons since we can't dynamically read directory contents in the browser
                const lessons = [
                    { id: '1', title: 'Basic Greetings' },
                    { id: '2', title: 'Animals' },
                    { id: '3', title: 'Introduction' },
                ];

                setAvailableLessons(lessons);
            } catch (error) {
                console.error('Error loading available lessons:', error);
            }
        };
        loadAvailableLessons();
    }, []);

    // Load selected lesson set
    useEffect(() => {
        if (selectedLessonSet && currentLanguage) {
            const loadLessonData = async () => {
                setLoading(true);
                try {
                    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
                    const response = await fetch(
                        `${basePath}/${currentLanguage}/${selectedLessonSet}.json`,
                    );
                    if (!response.ok) {
                        throw new Error('Failed to load lesson data');
                    }
                    const data: LessonSet = await response.json();
                    setLessonData(data);
                    setCurrentLesson(0);
                    setSelectedAnswer('');
                    setShowResult(false);
                } catch (error) {
                    console.error('Error loading lesson data:', error);
                } finally {
                    setLoading(false);
                }
            };
            loadLessonData();
        }
    }, [selectedLessonSet, currentLanguage]);

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
        if (!lessonData) return;

        const correct = selectedAnswer === lessonData.lessons[currentLesson].correct;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            setScore(score + 10);
        } else {
            setHearts(Math.max(0, hearts - 1));
        }
    };

    const handleNext = () => {
        setShowResult(false);
        setSelectedAnswer('');
        if (lessonData && currentLesson < lessonData.lessons.length - 1) {
            setCurrentLesson(currentLesson + 1);
        } else {
            // Lesson set completed, go back to lesson selection
            setSelectedLessonSet(null);
            setLessonData(null);
            setCurrentLesson(0);
        }
    };

    const handleLanguageToggle = (languageCode: string) => {
        setSelectedLanguages((prev) => {
            if (prev.includes(languageCode)) {
                return prev.filter((lang) => lang !== languageCode);
            } else {
                return [...prev, languageCode];
            }
        });
    };

    const handleLanguageSelect = (languageCode: string) => {
        setCurrentLanguage(languageCode);
    };

    const handleLessonSelect = (lessonId: string) => {
        setSelectedLessonSet(lessonId);
    };

    const handleBackToSelection = () => {
        setSelectedLessonSet(null);
        setLessonData(null);
        setCurrentLesson(0);
        setSelectedAnswer('');
        setShowResult(false);
    };

    const handleBackToLanguages = () => {
        const goingToSingleChoiceScreenB = selectedLanguages.length === 1 && !currentLanguage;

        setCurrentLanguage(null);
        setSelectedLessonSet(null);
        setLessonData(null);
        setCurrentLesson(0);
        setSelectedAnswer('');
        setShowResult(false);

        if (goingToSingleChoiceScreenB) {
            setSelectedLanguages([]);
        }
    };

    // Calculate progress percentage - starts at 0% and fills up as lessons are completed
    const progressPercentage = lessonData ? (currentLesson / lessonData.lessons.length) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
            {/* Header */}
            <header className="bg-white shadow-lg">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl rounded-[23px] w-[18px] h-[31px]">
                                🦉
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">TrioLingo</h1>
                    </div>

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

            {/* Progress Bar */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-green-500 rounded-full transition-all duration-500 h-3"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {lessonData
                            ? `Lesson ${currentLesson + 1} of ${lessonData.lessons.length}`
                            : 'Select a lesson to begin'}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {currentLanguage ? (
                        // If currentLanguage is set, proceed to lesson selection or lesson content
                        !selectedLessonSet ? (
                            /* Lesson Selection Screen */
                            <div className="text-center">
                                <div className="flex items-center justify-between mb-6">
                                    <button
                                        onClick={handleBackToLanguages}
                                        className="text-blue-500 hover:text-blue-600 font-medium"
                                    >
                                        ← Back to Languages
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">
                                            {
                                                availableLanguages.find(
                                                    (l) => l.code === currentLanguage,
                                                )?.flag
                                            }
                                        </span>
                                        <span className="text-lg font-semibold text-gray-600">
                                            {
                                                availableLanguages.find(
                                                    (l) => l.code === currentLanguage,
                                                )?.name
                                            }
                                        </span>
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                                    Choose a Lesson
                                </h2>
                                <div className="space-y-4">
                                    {availableLessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => handleLessonSelect(lesson.id)}
                                            className="w-full p-6 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                                                        {lesson.title}
                                                    </h3>
                                                    <p className="text-gray-600 mt-1">
                                                        Lesson {lesson.id}
                                                    </p>
                                                </div>
                                                <div className="text-blue-500 text-2xl">→</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : loading ? (
                            /* Loading Screen */
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">⏳</div>
                                <h2 className="text-2xl font-bold text-gray-800">Loading lesson...</h2>
                            </div>
                        ) : lessonData && !showResult ? (
                            /* Question Screen */
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <button
                                        onClick={handleBackToSelection}
                                        className="text-blue-500 hover:text-blue-600 font-medium"
                                    >
                                        ← Back to Lessons
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">
                                            {
                                                availableLanguages.find(
                                                    (l) => l.code === currentLanguage,
                                                )?.flag
                                            }
                                        </span>
                                        <h3 className="text-lg font-semibold text-gray-600">
                                            {lessonData.title}
                                        </h3>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                                    {lessonData.lessons[currentLesson].question}
                                </h2>

                                <div className="space-y-4">
                                    {lessonData.lessons[currentLesson].options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(option)}
                                            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                                                selectedAnswer === option
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-lg font-medium">{option}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedAnswer}
                                    className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                                        selectedAnswer
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    CHECK
                                </button>
                            </>
                        ) : lessonData && showResult ? (
                            /* Result Screen */
                            <div className="text-center">
                                <div
                                    className={`text-6xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                >
                                    {isCorrect ? '🎉' : '😞'}
                                </div>
                                <h2
                                    className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {isCorrect ? 'Correct!' : 'Incorrect'}
                                </h2>
                                {!isCorrect && (
                                    <p className="text-gray-600 mb-6">
                                        The correct answer was:{' '}
                                        <span className="font-bold">
                                            {lessonData.lessons[currentLesson].correct}
                                        </span>
                                    </p>
                                )}
                                {isCorrect && <p className="text-gray-600 mb-6">+10 XP earned!</p>}
                                <button
                                    onClick={handleNext}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200"
                                >
                                    {currentLesson < lessonData.lessons.length - 1
                                        ? 'CONTINUE'
                                        : 'COMPLETE LESSON'}
                                </button>
                            </div>
                        ) : null // End of currentLanguage is set block
                    ) : selectedLanguages.length === 0 ? (
                        /* Language Selection Screen (initial toggles) */
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Select Languages to Learn
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Choose one or more languages you\'d like to practice
                            </p>
                            <div className="space-y-4">
                                {availableLanguages.map((language) => (
                                    <button
                                        key={language.code}
                                        onClick={() => handleLanguageToggle(language.code)}
                                        className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 group ${
                                            selectedLanguages.includes(language.code)
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-3xl">{language.flag}</span>
                                                <div>
                                                    <h3
                                                        className={`text-xl font-bold ${
                                                            selectedLanguages.includes(
                                                                language.code,
                                                            )
                                                                ? 'text-green-600'
                                                                : 'text-gray-800 group-hover:text-blue-600'
                                                        }`}
                                                    >
                                                        {language.name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div
                                                className={`text-2xl ${
                                                    selectedLanguages.includes(language.code)
                                                        ? 'text-green-500'
                                                        : 'text-blue-500'
                                                }`}
                                            >
                                                {selectedLanguages.includes(language.code)
                                                    ? '✓'
                                                    : '+'}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {selectedLanguages.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Selected Languages:
                                    </h3>
                                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                                        {selectedLanguages.map((langCode) => {
                                            const language = availableLanguages.find(
                                                (l) => l.code === langCode,
                                            );
                                            return (
                                                <span
                                                    key={langCode}
                                                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                                                >
                                                    <span>{language?.flag}</span>
                                                    <span>{language?.name}</span>
                                                </span>
                                            );
                                        })}
                                    </div>
                                    {/* This part for "Start Learning X" buttons could be removed or adapted if not used */}
                                    {/* For now, the logic relies on transitioning away from this screen */}
                                </div>
                            )}
                        </div>
                    ) : selectedLanguages.length === 1 ? (
                        // If only one language is selected (and currentLanguage is null), auto-select it
                        <AutoSelectLanguageComponent
                            lang={selectedLanguages[0]}
                            onSelected={handleLanguageSelect}
                        />
                    ) : (
                        /* Language Choice Screen (for multiple selected languages) */
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                                Choose a Language
                            </h2>
                            <div className="space-y-4">
                                {selectedLanguages.map((langCode) => {
                                    const language = availableLanguages.find(
                                        (l) => l.code === langCode,
                                    );
                                    return (
                                        <button
                                            key={langCode}
                                            onClick={() => handleLanguageSelect(langCode)}
                                            className="w-full p-6 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-3xl">
                                                        {language?.flag}
                                                    </span>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                                                            {language?.name}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="text-blue-500 text-2xl">→</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setSelectedLanguages([])} // This button takes back to the initial toggle screen
                                className="mt-6 text-blue-500 hover:text-blue-600 font-medium"
                            >
                                ← Back to Language Selection
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-white/80">
                <p className="text-sm">
                    Built with ❤️ by{' '}
                    <a href="https://github.com/isaaclins" className="text-white/80">
                        Isaac Lins
                    </a>
                </p>
            </footer>
        </div>
    );
}
