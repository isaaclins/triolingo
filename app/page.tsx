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
        setCurrentLanguage(null);
        setSelectedLessonSet(null);
        setLessonData(null);
        setCurrentLesson(0);
        setSelectedAnswer('');
        setShowResult(false);
    };

    // Calculate progress percentage - starts at 0% and fills up as lessons are completed
    const progressPercentage = lessonData ? (currentLesson / lessonData.lessons.length) * 100 : 0;

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600"
            data-oid="kt9yt3x"
        >
            {/* Header */}
            <header className="bg-white shadow-lg" data-oid="lk50ra_">
                <div
                    className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between"
                    data-oid="knjc2-t"
                >
                    <div className="flex items-center space-x-4" data-oid="q95gfli">
                        <div
                            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                            data-oid="44jfiwa"
                        >
                            <span
                                className="text-white font-bold text-xl rounded-[23px] w-[18px] h-[31px]"
                                data-oid="o61xltl"
                            >
                                🦉
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800" data-oid="6zxem82">
                            TrioLingo
                        </h1>
                    </div>

                    <div className="flex items-center space-x-6" data-oid="mldeu.m">
                        <div className="flex items-center space-x-2" data-oid="uv1ryu2">
                            <span className="text-orange-500" data-oid="zj:_6ad">
                                🔥
                            </span>
                            <span className="font-bold text-gray-700" data-oid="r17bz20">
                                {streak}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="3cjwr3j">
                            <span className="text-red-500" data-oid="8lll_8y">
                                ❤️
                            </span>
                            <span className="font-bold text-gray-700" data-oid="eh9njnk">
                                {hearts}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="a:pbtqf">
                            <span className="text-yellow-500" data-oid="n_o1y:1">
                                ⭐
                            </span>
                            <span className="font-bold text-gray-700" data-oid="v.eg_9.">
                                {score}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-white border-b" data-oid="8wfevkb">
                <div className="max-w-4xl mx-auto px-4 py-3" data-oid="0vabr3k">
                    <div className="w-full bg-gray-200 rounded-full h-3" data-oid="89fpw6v">
                        <div
                            className="bg-green-500 rounded-full transition-all duration-500 h-3"
                            style={{ width: `${progressPercentage}%` }}
                            data-oid="uxi66uh"
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2" data-oid="08.9i5h">
                        {lessonData
                            ? `Lesson ${currentLesson + 1} of ${lessonData.lessons.length}`
                            : 'Select a lesson to begin'}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-8" data-oid="5fq2mfd">
                <div className="bg-white rounded-2xl shadow-xl p-8" data-oid="upy6u:k">
                    {selectedLanguages.length === 0 ? (
                        /* Language Selection Screen */
                        <div className="text-center" data-oid="1lkfh_s">
                            <h2
                                className="text-3xl font-bold text-gray-800 mb-4"
                                data-oid="rpm:q08"
                            >
                                Select Languages to Learn
                            </h2>
                            <p className="text-gray-600 mb-8" data-oid="ps72v82">
                                Choose one or more languages you'd like to practice
                            </p>
                            <div className="space-y-4" data-oid="ca9xm7-">
                                {availableLanguages.map((language) => (
                                    <button
                                        key={language.code}
                                        onClick={() => handleLanguageToggle(language.code)}
                                        className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 group ${
                                            selectedLanguages.includes(language.code)
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                                        }`}
                                        data-oid="cak4-sl"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="edqzgvh"
                                        >
                                            <div
                                                className="flex items-center space-x-4"
                                                data-oid="gyxlc_j"
                                            >
                                                <span className="text-3xl" data-oid="2p94:ih">
                                                    {language.flag}
                                                </span>
                                                <div data-oid=".8gs4mf">
                                                    <h3
                                                        className={`text-xl font-bold ${
                                                            selectedLanguages.includes(
                                                                language.code,
                                                            )
                                                                ? 'text-green-600'
                                                                : 'text-gray-800 group-hover:text-blue-600'
                                                        }`}
                                                        data-oid="8y31z73"
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
                                                data-oid="zn4kx3y"
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
                                <div className="mt-8" data-oid=":-eu1r4">
                                    <h3
                                        className="text-lg font-semibold text-gray-800 mb-4"
                                        data-oid="xavu4r2"
                                    >
                                        Selected Languages:
                                    </h3>
                                    <div
                                        className="flex flex-wrap gap-2 justify-center mb-6"
                                        data-oid="61oajlb"
                                    >
                                        {selectedLanguages.map((langCode) => {
                                            const language = availableLanguages.find(
                                                (l) => l.code === langCode,
                                            );
                                            return (
                                                <span
                                                    key={langCode}
                                                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                                                    data-oid="krxkqi-"
                                                >
                                                    <span data-oid="3z4yov-">{language?.flag}</span>
                                                    <span data-oid="0dtmev8">{language?.name}</span>
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <div className="space-y-3" data-oid="q-0huk9">
                                        {selectedLanguages.map((langCode) => {
                                            const language = availableLanguages.find(
                                                (l) => l.code === langCode,
                                            );
                                            return (
                                                <button
                                                    key={langCode}
                                                    onClick={() => handleLanguageSelect(langCode)}
                                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                                                    data-oid="9_z8acu"
                                                >
                                                    <span data-oid="9pesbqz">{language?.flag}</span>
                                                    <span data-oid="sw-7ms:">
                                                        Start Learning {language?.name}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : !currentLanguage ? (
                        /* Language Choice Screen */
                        <div className="text-center" data-oid="3g54071">
                            <h2
                                className="text-3xl font-bold text-gray-800 mb-8"
                                data-oid="13yxrj8"
                            >
                                Choose a Language
                            </h2>
                            <div className="space-y-4" data-oid="k0nodem">
                                {selectedLanguages.map((langCode) => {
                                    const language = availableLanguages.find(
                                        (l) => l.code === langCode,
                                    );
                                    return (
                                        <button
                                            key={langCode}
                                            onClick={() => handleLanguageSelect(langCode)}
                                            className="w-full p-6 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                                            data-oid="0ulvhqi"
                                        >
                                            <div
                                                className="flex items-center justify-between"
                                                data-oid="_-4br:1"
                                            >
                                                <div
                                                    className="flex items-center space-x-4"
                                                    data-oid="iiffku0"
                                                >
                                                    <span className="text-3xl" data-oid="e:8d.s4">
                                                        {language?.flag}
                                                    </span>
                                                    <div data-oid="4x5pbw:">
                                                        <h3
                                                            className="text-xl font-bold text-gray-800 group-hover:text-blue-600"
                                                            data-oid="aklrkp3"
                                                        >
                                                            {language?.name}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div
                                                    className="text-blue-500 text-2xl"
                                                    data-oid="_ipaarb"
                                                >
                                                    →
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setSelectedLanguages([])}
                                className="mt-6 text-blue-500 hover:text-blue-600 font-medium"
                                data-oid="ldcxk96"
                            >
                                ← Back to Language Selection
                            </button>
                        </div>
                    ) : !selectedLessonSet ? (
                        /* Lesson Selection Screen */
                        <div className="text-center" data-oid=".u1iyf0">
                            <div
                                className="flex items-center justify-between mb-6"
                                data-oid="ua09kz5"
                            >
                                <button
                                    onClick={handleBackToLanguages}
                                    className="text-blue-500 hover:text-blue-600 font-medium"
                                    data-oid="mgcsx2x"
                                >
                                    ← Back to Languages
                                </button>
                                <div className="flex items-center space-x-2" data-oid="gb.j-:2">
                                    <span className="text-2xl" data-oid="y0z5tos">
                                        {
                                            availableLanguages.find(
                                                (l) => l.code === currentLanguage,
                                            )?.flag
                                        }
                                    </span>
                                    <span
                                        className="text-lg font-semibold text-gray-600"
                                        data-oid="iygk.k5"
                                    >
                                        {
                                            availableLanguages.find(
                                                (l) => l.code === currentLanguage,
                                            )?.name
                                        }
                                    </span>
                                </div>
                            </div>
                            <h2
                                className="text-3xl font-bold text-gray-800 mb-8"
                                data-oid="b8yalgl"
                            >
                                Choose a Lesson
                            </h2>
                            <div className="space-y-4" data-oid="omos10z">
                                {availableLessons.map((lesson) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => handleLessonSelect(lesson.id)}
                                        className="w-full p-6 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                                        data-oid="l2rnm5a"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="ggjtybd"
                                        >
                                            <div data-oid=".yo4gbp">
                                                <h3
                                                    className="text-xl font-bold text-gray-800 group-hover:text-blue-600"
                                                    data-oid="oxq3lla"
                                                >
                                                    {lesson.title}
                                                </h3>
                                                <p
                                                    className="text-gray-600 mt-1"
                                                    data-oid="nq3a1s0"
                                                >
                                                    Lesson {lesson.id}
                                                </p>
                                            </div>
                                            <div
                                                className="text-blue-500 text-2xl"
                                                data-oid="3fojj_g"
                                            >
                                                →
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : loading ? (
                        /* Loading Screen */
                        <div className="text-center py-12" data-oid="fr0msw8">
                            <div className="text-4xl mb-4" data-oid="sknf2a0">
                                ⏳
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800" data-oid="xs_ldc0">
                                Loading lesson...
                            </h2>
                        </div>
                    ) : lessonData && !showResult ? (
                        /* Question Screen */
                        <>
                            <div
                                className="flex items-center justify-between mb-6"
                                data-oid="yacnmzo"
                            >
                                <button
                                    onClick={handleBackToSelection}
                                    className="text-blue-500 hover:text-blue-600 font-medium"
                                    data-oid="0p5dq4:"
                                >
                                    ← Back to Lessons
                                </button>
                                <div className="flex items-center space-x-2" data-oid="i8dd5zq">
                                    <span className="text-lg" data-oid="0nd3egk">
                                        {
                                            availableLanguages.find(
                                                (l) => l.code === currentLanguage,
                                            )?.flag
                                        }
                                    </span>
                                    <h3
                                        className="text-lg font-semibold text-gray-600"
                                        data-oid="hjn962d"
                                    >
                                        {lessonData.title}
                                    </h3>
                                </div>
                            </div>

                            <h2
                                className="text-2xl font-bold text-gray-800 mb-8 text-center"
                                data-oid="z.6cl3d"
                            >
                                {lessonData.lessons[currentLesson].question}
                            </h2>

                            <div className="space-y-4" data-oid="wo476p-">
                                {lessonData.lessons[currentLesson].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                                            selectedAnswer === option
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                        data-oid=":.11a.h"
                                    >
                                        <span className="text-lg font-medium" data-oid=".:5je6f">
                                            {option}
                                        </span>
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
                                data-oid="_9l3fji"
                            >
                                CHECK
                            </button>
                        </>
                    ) : lessonData && showResult ? (
                        /* Result Screen */
                        <div className="text-center" data-oid="yri7od5">
                            <div
                                className={`text-6xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                data-oid="dxcg.g_"
                            >
                                {isCorrect ? '🎉' : '😞'}
                            </div>
                            <h2
                                className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                                data-oid="rrmf7z6"
                            >
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </h2>
                            {!isCorrect && (
                                <p className="text-gray-600 mb-6" data-oid="t2jfduj">
                                    The correct answer was:{' '}
                                    <span className="font-bold" data-oid="y6tjxdt">
                                        {lessonData.lessons[currentLesson].correct}
                                    </span>
                                </p>
                            )}
                            {isCorrect && (
                                <p className="text-gray-600 mb-6" data-oid="kafxcd.">
                                    +10 XP earned!
                                </p>
                            )}
                            <button
                                onClick={handleNext}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200"
                                data-oid="46j7tzs"
                            >
                                {currentLesson < lessonData.lessons.length - 1
                                    ? 'CONTINUE'
                                    : 'COMPLETE LESSON'}
                            </button>
                        </div>
                    ) : null}
                </div>

                {/* GitHub Pages Info */}
                <div
                    className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white"
                    data-oid="4acdxb-"
                >
                    <h3 className="text-lg font-bold mb-2" data-oid="l83m92h">
                        🚀 Deploy on GitHub Pages
                    </h3>
                    <p className="text-sm opacity-90" data-oid="n5yvgby">
                        This game runs entirely in the browser with no backend required. Perfect for
                        GitHub Pages deployment using GitHub Actions workflows!
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2" data-oid="8htid5d">
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="4x_7akv"
                        >
                            No Registration
                        </span>
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="zfr6ulf"
                        >
                            Client-Side Only
                        </span>
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="y-mzx_p"
                        >
                            GitHub Actions Ready
                        </span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-white/80" data-oid="3dpmb2l">
                <p className="text-sm" data-oid="ob_epom">
                    Built with React & Tailwind CSS • Ready for GitHub Pages deployment
                </p>
            </footer>
        </div>
    );
}
