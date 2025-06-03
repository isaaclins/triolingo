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

export default function Page() {
    const [currentLesson, setCurrentLesson] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(3);
    const [hearts, setHearts] = useState(5);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedLessonSet, setSelectedLessonSet] = useState<string | null>(null);
    const [lessonData, setLessonData] = useState<LessonSet | null>(null);
    const [availableLessons, setAvailableLessons] = useState<{ id: string; title: string }[]>([]);
    const [loading, setLoading] = useState(false);

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
        if (selectedLessonSet) {
            const loadLessonData = async () => {
                setLoading(true);
                try {
                    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
                    const response = await fetch(`${basePath}/spanish/${selectedLessonSet}.json`);
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
    }, [selectedLessonSet]);

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

    // Calculate progress percentage - starts at 0% and fills up as lessons are completed
    const progressPercentage = lessonData ? (currentLesson / lessonData.lessons.length) * 100 : 0;

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600"
            data-oid="a3pj6q5"
        >
            {/* Header */}
            <header className="bg-white shadow-lg" data-oid="m_tvu.9">
                <div
                    className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between"
                    data-oid="rg.gwcr"
                >
                    <div className="flex items-center space-x-4" data-oid="o083s9k">
                        <div
                            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                            data-oid="mctyoz7"
                        >
                            <span
                                className="text-white font-bold text-xl rounded-[23px] w-[18px] h-[31px]"
                                data-oid="pqyaq91"
                            >
                                🦉
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800" data-oid="nz46x-4">
                            TrioLingo
                        </h1>
                    </div>

                    <div className="flex items-center space-x-6" data-oid="f__sf-a">
                        <div className="flex items-center space-x-2" data-oid="1et.zb2">
                            <span className="text-orange-500" data-oid="rf8q-uy">
                                🔥
                            </span>
                            <span className="font-bold text-gray-700" data-oid="krr-uaj">
                                {streak}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="5olzq3y">
                            <span className="text-red-500" data-oid="2g6z076">
                                ❤️
                            </span>
                            <span className="font-bold text-gray-700" data-oid="y:_2eib">
                                {hearts}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="uxunn28">
                            <span className="text-yellow-500" data-oid="tzmup47">
                                ⭐
                            </span>
                            <span className="font-bold text-gray-700" data-oid="xwnu-14">
                                {score}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-white border-b" data-oid="b4xwp5e">
                <div className="max-w-4xl mx-auto px-4 py-3" data-oid="9ez9smi">
                    <div className="w-full bg-gray-200 rounded-full h-3" data-oid="2zhl0xj">
                        <div
                            className="bg-green-500 rounded-full transition-all duration-500 h-3"
                            style={{ width: `${progressPercentage}%` }}
                            data-oid="qyun784"
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2" data-oid="-8eml61">
                        {lessonData
                            ? `Lesson ${currentLesson + 1} of ${lessonData.lessons.length}`
                            : 'Select a lesson to begin'}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-8" data-oid="xwgms7k">
                <div className="bg-white rounded-2xl shadow-xl p-8" data-oid="ei.:tmw">
                    {!selectedLessonSet ? (
                        /* Lesson Selection Screen */
                        <div className="text-center" data-oid="sg_.k2c">
                            <h2
                                className="text-3xl font-bold text-gray-800 mb-8"
                                data-oid="w7.2cqn"
                            >
                                Choose a Lesson
                            </h2>
                            <div className="space-y-4" data-oid="ll1_:iz">
                                {availableLessons.map((lesson) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => handleLessonSelect(lesson.id)}
                                        className="w-full p-6 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                                        data-oid="ric-7tt"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="wgnksg-"
                                        >
                                            <div data-oid="kjl6zca">
                                                <h3
                                                    className="text-xl font-bold text-gray-800 group-hover:text-blue-600"
                                                    data-oid="os9fg:x"
                                                >
                                                    {lesson.title}
                                                </h3>
                                                <p
                                                    className="text-gray-600 mt-1"
                                                    data-oid="jvh8d-f"
                                                >
                                                    Lesson {lesson.id}
                                                </p>
                                            </div>
                                            <div
                                                className="text-blue-500 text-2xl"
                                                data-oid="31yr-m_"
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
                        <div className="text-center py-12" data-oid="341uch3">
                            <div className="text-4xl mb-4" data-oid="tu_sdnw">
                                ⏳
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800" data-oid="cdsvgs-">
                                Loading lesson...
                            </h2>
                        </div>
                    ) : lessonData && !showResult ? (
                        /* Question Screen */
                        <>
                            <div
                                className="flex items-center justify-between mb-6"
                                data-oid="f29xjq7"
                            >
                                <button
                                    onClick={handleBackToSelection}
                                    className="text-blue-500 hover:text-blue-600 font-medium"
                                    data-oid="mg-:9_y"
                                >
                                    ← Back to Lessons
                                </button>
                                <h3
                                    className="text-lg font-semibold text-gray-600"
                                    data-oid="5acqkm1"
                                >
                                    {lessonData.title}
                                </h3>
                            </div>

                            <h2
                                className="text-2xl font-bold text-gray-800 mb-8 text-center"
                                data-oid="79-_zj8"
                            >
                                {lessonData.lessons[currentLesson].question}
                            </h2>

                            <div className="space-y-4" data-oid="87-:b69">
                                {lessonData.lessons[currentLesson].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                                            selectedAnswer === option
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                        data-oid="w2dk_vn"
                                    >
                                        <span className="text-lg font-medium" data-oid="qi1jj6n">
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
                                data-oid="v6.bxz:"
                            >
                                CHECK
                            </button>
                        </>
                    ) : lessonData && showResult ? (
                        /* Result Screen */
                        <div className="text-center" data-oid="btinp4v">
                            <div
                                className={`text-6xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                data-oid="8:i4iiz"
                            >
                                {isCorrect ? '🎉' : '😞'}
                            </div>
                            <h2
                                className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                                data-oid="mw-anep"
                            >
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </h2>
                            {!isCorrect && (
                                <p className="text-gray-600 mb-6" data-oid="o2998lf">
                                    The correct answer was:{' '}
                                    <span className="font-bold" data-oid="dgnvf99">
                                        {lessonData.lessons[currentLesson].correct}
                                    </span>
                                </p>
                            )}
                            {isCorrect && (
                                <p className="text-gray-600 mb-6" data-oid="6-g5d0b">
                                    +10 XP earned!
                                </p>
                            )}
                            <button
                                onClick={handleNext}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200"
                                data-oid="j839s2s"
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
                    data-oid="paxfqbs"
                >
                    <h3 className="text-lg font-bold mb-2" data-oid="hp8n_74">
                        🚀 Deploy on GitHub Pages
                    </h3>
                    <p className="text-sm opacity-90" data-oid="m0q00fq">
                        This game runs entirely in the browser with no backend required. Perfect for
                        GitHub Pages deployment using GitHub Actions workflows!
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2" data-oid="2-q1x0u">
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="gjq93.m"
                        >
                            No Registration
                        </span>
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="9a5auls"
                        >
                            Client-Side Only
                        </span>
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="8lfbtyx"
                        >
                            GitHub Actions Ready
                        </span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-white/80" data-oid="pwl-ak1">
                <p className="text-sm" data-oid="ybnr12s">
                    Built with React & Tailwind CSS • Ready for GitHub Pages deployment
                </p>
            </footer>
        </div>
    );
}
