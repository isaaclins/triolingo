'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface GlobalState {
    score: number;
    setScore: Dispatch<SetStateAction<number>>;
    hearts: number;
    setHearts: Dispatch<SetStateAction<number>>;
    streak: number;
    setStreak: Dispatch<SetStateAction<number>>;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(5);
    const [streak, setStreak] = useState(3); // Initial streak

    return (
        <GlobalStateContext.Provider value={{ score, setScore, hearts, setHearts, streak, setStreak }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
}; 
