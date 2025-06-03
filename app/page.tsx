'use client';

import { useState, useEffect } from 'react';

export default function Page() {
    const [currentLesson, setCurrentLesson] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(3);
    const [hearts, setHearts] = useState(5);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const lessons = [
        {
            question: "What does 'Hola' mean in English?",
            options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
            correct: 'Hello',
            type: 'multiple-choice',
        },
        {
            question: "Choose the correct translation for 'cat':",
            options: ['perro', 'gato', 'casa', 'agua'],
            correct: 'gato',
            type: 'multiple-choice',
        },
        {
            question: "Complete: 'Me llamo ___'",
            options: ['es', 'soy', 'Maria', 'tengo'],
            correct: 'Maria',
            type: 'fill-blank',
        },
    ];

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
        const correct = selectedAnswer === lessons[currentLesson].correct;
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
        if (currentLesson < lessons.length - 1) {
            setCurrentLesson(currentLesson + 1);
        } else {
            setCurrentLesson(0); // Reset for demo
        }
    };

    const progressPercentage = ((currentLesson + 1) / lessons.length) * 100;

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600"
            data-oid="nvhfyra"
        >
            {/* Header */}
            <header className="bg-white shadow-lg" data-oid=".5brmic">
                <div
                    className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between"
                    data-oid="9_9mrb2"
                >
                    <div className="flex items-center space-x-4" data-oid="9399xz5">
                        <div
                            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                            data-oid="f1eu4_o"
                        >
                            <span
                                className="text-white font-bold text-xl rounded-[23px] w-[18px] h-[31px]"
                                data-oid="_wfc8r."
                            >
                                🦉
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800" data-oid="amki_01">
                            LinguaLearn
                        </h1>
                    </div>

                    <div className="flex items-center space-x-6" data-oid="y:kilf_">
                        <div className="flex items-center space-x-2" data-oid="6.x-1z0">
                            <span className="text-orange-500" data-oid="f0caogz">
                                🔥
                            </span>
                            <span className="font-bold text-gray-700" data-oid="qw8i0_0">
                                {streak}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="be0-f8u">
                            <span className="text-red-500" data-oid="hv6yu1h">
                                ❤️
                            </span>
                            <span className="font-bold text-gray-700" data-oid="-n7rx5k">
                                {hearts}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="1wxh4x.">
                            <span className="text-yellow-500" data-oid="y.p04s1">
                                ⭐
                            </span>
                            <span className="font-bold text-gray-700" data-oid="yw.8ozt">
                                {score}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-white border-b" data-oid=":opjrbq">
                <div className="max-w-4xl mx-auto px-4 py-3" data-oid="0lri527">
                    <div className="w-full bg-gray-200 rounded-full h-3" data-oid="og9mgcf">
                        <div
                            className="bg-green-500 rounded-full transition-all duration-500 w-[44px] h-[13px]"
                            style={{ width: `${progressPercentage}%` }}
                            data-oid="7k7tlrm"
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2" data-oid="4pdrxg_">
                        Lesson {currentLesson + 1} of {lessons.length}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-8" data-oid="npmi383">
                <div className="bg-white rounded-2xl shadow-xl p-8" data-oid="-8hpzj4">
                    {!showResult ? (
                        <>
                            <h2
                                className="text-2xl font-bold text-gray-800 mb-8 text-center"
                                data-oid="s40vh6q"
                            >
                                {lessons[currentLesson].question}
                            </h2>

                            <div className="space-y-4" data-oid="sury0.g">
                                {lessons[currentLesson].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                                            selectedAnswer === option
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                        data-oid=":ev0l50"
                                    >
                                        <span className="text-lg font-medium" data-oid="k.de_hb">
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
                                data-oid="wyodctz"
                            >
                                CHECK
                            </button>
                        </>
                    ) : (
                        <div className="text-center" data-oid="99x16cd">
                            <div
                                className={`text-6xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                data-oid="fw2ed.7"
                            >
                                {isCorrect ? '🎉' : '😞'}
                            </div>
                            <h2
                                className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                                data-oid="_y1mkei"
                            >
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </h2>
                            {!isCorrect && (
                                <p className="text-gray-600 mb-6" data-oid="bkjz4zw">
                                    The correct answer was:{' '}
                                    <span className="font-bold" data-oid="tutg4i1">
                                        {lessons[currentLesson].correct}
                                    </span>
                                </p>
                            )}
                            {isCorrect && (
                                <p className="text-gray-600 mb-6" data-oid="wqmufy4">
                                    +10 XP earned!
                                </p>
                            )}
                            <button
                                onClick={handleNext}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200"
                                data-oid="q1_zvt2"
                            >
                                CONTINUE
                            </button>
                        </div>
                    )}
                </div>

                {/* GitHub Pages Info */}
                <div
                    className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white"
                    data-oid="5m_bal3"
                >
                    <h3 className="text-lg font-bold mb-2" data-oid="8b3q57_">
                        🚀 Deploy on GitHub Pages
                    </h3>
                    <p className="text-sm opacity-90" data-oid="uiu0a6w">
                        This game runs entirely in the browser with no backend required. Perfect for
                        GitHub Pages deployment using GitHub Actions workflows!
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2" data-oid="qap8yei">
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="p24qc0x"
                        >
                            No Registration
                        </span>
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="t5gmpn1"
                        >
                            Client-Side Only
                        </span>
                        <span
                            className="bg-white/20 px-3 py-1 rounded-full text-xs"
                            data-oid="_xwkkyx"
                        >
                            GitHub Actions Ready
                        </span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-white/80" data-oid="bytmejp">
                <p className="text-sm" data-oid="xpg0ku-">
                    Built with React & Tailwind CSS • Ready for GitHub Pages deployment
                </p>
            </footer>
        </div>
    );
}
