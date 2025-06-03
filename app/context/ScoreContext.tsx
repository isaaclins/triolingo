'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Score {
  correct: number;
  incorrect: number;
}

interface Scores {
  [languageCode: string]: Score;
}

interface ScoreContextType {
  scores: Scores;
  incrementCorrect: (languageCode: string) => void;
  incrementIncorrect: (languageCode: string) => void;
  getScore: (languageCode: string) => Score;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [scores, setScores] = useState<Scores>({});

  useEffect(() => {
    const storedScores = localStorage.getItem('languageScores');
    if (storedScores) {
      try {
        setScores(JSON.parse(storedScores));
      } catch (error) {
        console.error("Failed to parse scores from localStorage", error);
        localStorage.removeItem('languageScores'); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      localStorage.setItem('languageScores', JSON.stringify(scores));
    }
  }, [scores]);

  const incrementCorrect = (languageCode: string) => {
    setScores(prevScores => ({
      ...prevScores,
      [languageCode]: {
        correct: (prevScores[languageCode]?.correct || 0) + 1,
        incorrect: prevScores[languageCode]?.incorrect || 0,
      },
    }));
  };

  const incrementIncorrect = (languageCode: string) => {
    setScores(prevScores => ({
      ...prevScores,
      [languageCode]: {
        correct: prevScores[languageCode]?.correct || 0,
        incorrect: (prevScores[languageCode]?.incorrect || 0) + 1,
      },
    }));
  };

  const getScore = (languageCode: string): Score => {
    return scores[languageCode] || { correct: 0, incorrect: 0 };
  };

  return (
    <ScoreContext.Provider value={{ scores, incrementCorrect, incrementIncorrect, getScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = (): ScoreContextType => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
}; 
