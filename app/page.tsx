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
                    const response = await fetch(`/spanish/${selectedLessonSet}.json`);
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
            data-oid="ihpfqqd"
        >
            {/* Header */}
            <header className="bg-white shadow-lg" data-oid="k94g1q3">
                <div
                    className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between"
                    data-oid="h0pt.sa"
                >
                    <div className="flex items-center space-x-4" data-oid="vnck70.">
                        <div
                            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                            data-oid="d2nhrfx"
                        >
                            <span
                                className="text-white font-bold text-xl rounded-[23px] w-[18px] h-[31px]"
                                data-oid="zy3rft_"
                            >
                                🦉
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800" data-oid="acjgxf-">
                            TrioLingo
                        </h1>
                    </div>

                    <div className="flex items-center space-x-6" data-oid="avnx7wb">
                        <div className="flex items-center space-x-2" data-oid="fn26fli">
                            <span className="text-orange-500" data-oid="xhm0mdk">
                                🔥
                            </span>
                            <span className="font-bold text-gray-700" data-oid="v3ll9_y">
                                {streak}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="qo505tg">
                            <span className="text-red-500" data-oid="muuzla3">
                                ❤️
                            </span>
                            <span className="font-bold text-gray-700" data-oid="2fd97-e">
                                {hearts}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="u:5n4rf">
                            <span className="text-yellow-500" data-oid=".45yhor">
                                ⭐
                            </span>
                            <span className="font-bold text-gray-700" data-oid="3s.y6u6">
                                {score}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-white border-b" data-oid=".bii7m5">
                <div className="max-w-4xl mx-auto px-4 py-3" data-oid="0zakayu">
                    <div className="w-full bg-gray-200 rounded-full h-3" data-oid="eqcuik3">
                        <div
                            className="bg-green-500 rounded-full transition-all duration-500 h-3"
                            style={{ width: `${progressPercentage}%` }}
                            data-oid="mq2.9_y"
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2" data-oid="4v-c24y">
                        {lessonData
                            ? `Lesson ${currentLesson + 1} of ${lessonData.lessons.length}`
                            : 'Select a lesson to begin'}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-8" data-oid="k1sz56s">
                <div className="bg-white rounded-2xl shadow-xl p-8" data-oid="nqdi-a:">
                    {!selectedLessonSet ? (
                        /* Lesson Selection Screen */
                        <div className="text-center" data-oid="ftln4ms">
                            <h2
                                className="text-3xl font-bold text-gray-800 mb-8"
                                data-oid=".dt56xj"
                            >
                                Choose a Lesson
                            </h2>
                            <div className="space-y-4" data-oid="qkmbht2">
                                {availableLessons.map((lesson) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => handleLessonSelect(lesson.id)}
                                        className="w-full p-6 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                                        data-oid="3o3ht_h"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="rs978cq"
                                        >
                                            <div data-oid="v.rfj4x">
                                                <h3
                                                    className="text-xl font-bold text-gray-800 group-hover:text-blue-600"
                                                    data-oid="ty.pdn0"
                                                >
                                                    {lesson.title}
                                                </h3>
                                                <p
                                                    className="text-gray-600 mt-1"
                                                    data-oid="y-fxku-"
                                                >
                                                    Lesson {lesson.id}
                                                </p>
                                            </div>
                                            <div
                                                className="text-blue-500 text-2xl"
                                                data-oid="lm:r37l"
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
                        <div className="text-center py-12" data-oid="atiaem5">
                            <div className="text-4xl mb-4" data-oid="n_-s7zy">
                                ⏳
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800" data-oid="zckzert">
                                Loading lesson...
                            </h2>
                        </div>
                    ) : lessonData && !showResult ? (
                        /* Question Screen */
                        <>
                            <div
                                className="flex items-center justify-between mb-6"
                                data-oid="ul.dafc"
                            >
                                <button
                                    onClick={handleBackToSelection}
                                    className="text-blue-500 hover:text-blue-600 font-medium"
                                    data-oid="gvhjxjg"
                                >
                                    ← Back to Lessons
                                </button>
                                <h3
                                    className="text-lg font-semibold text-gray-600"
                                    data-oid="zqqil15"
                                >
                                    {lessonData.title}
                                </h3>
                            </div>

                            <h2
                                className="text-2xl font-bold text-gray-800 mb-8 text-center"
                                data-oid=":pl0gwj"
                            >
                                {lessonData.lessons[currentLesson].question}
                            </h2>

                            <div className="space-y-4" data-oid="o4og.-t">
                                {lessonData.lessons[currentLesson].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                                            selectedAnswer === option
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                        data-oid="ciruq20"
                                    >
                                        <span className="text-lg font-medium" data-oid="p-uyfqk">
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
                                data-oid="pp:-.hl"
                            >
                                CHECK
                            </button>
                        </>
                    ) : lessonData && showResult ? (
                        /* Result Screen */
                        <div className="text-center" data-oid="8z6yuhb">
                            <div
                                className={`text-6xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                data-oid="v964vzn"
                            >
                                {isCorrect ? '🎉' : '😞'}
                            </div>
                            <h2
                                className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                                data-oid="e_u1oda"
                            >
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </h2>
                            {!isCorrect && (
                                <p className="text-gray-600 mb-6" data-oid="eeb_-ma">
                                    The correct answer was:{' '}
                                    <span className="font-bold" data-oid="w:ho584">
                                        {lessonData.lessons[currentLesson].correct}
                                    </span>
                                </p>
                            )}
                            {isCorrect && (
                                <p className="text-gray-600 mb-6" data-oid=":xbaxjh">
                                    +10 XP earned!
                                </p>
                            )}
                            <button
                                onClick={handleNext}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200"
                                data-oid=":nfz5rx"
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
                    data-oid="::g.4i0"
                >
                    <h3 className="text-lg font-bold mb-2" data-oid="vwr28py">
                        🚀 Deploy on GitHub Pages
                    </h3>
                    <p className="text-sm opacity-90" data-oid="qvd:_qp">
                        This game runs entirely in the browser with no backend required. Perfect for
                        GitHub Pages deployment using GitHub Actions workflows!
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2" data-oid="o5ocdn-">
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="nxjd_2:"
                        >
                            No Registration
                        </span>
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="wefu7pt"
                        >
                            Client-Side Only
                        </span>
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="6tb_6ev"
                        >
                            GitHub Actions Ready
                        </span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-white/80" data-oid="s512pxe">
                <p className="text-sm" data-oid="hwl6kow">
                    Built with React & Tailwind CSS • Ready for GitHub Pages deployment
                </p>
            </footer>
        </div>
    );
}
