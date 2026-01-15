import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        phase: 'LOGIN', // LOGIN, LOADING, PLAYING, RESULT
        userId: null,
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        answers: [], // Array of { questionId, selectedOption, isCorrect }
        startTime: null,
        endTime: null,
    });

    const [error, setError] = useState(null);

    const setPhase = (phase) => {
        setGameState(prev => ({ ...prev, phase }));
    };

    const login = (id) => {
        setGameState(prev => ({ ...prev, userId: id, phase: 'LOADING' }));
    };

    const startGame = (questions) => {
        setGameState(prev => ({
            ...prev,
            questions,
            currentQuestionIndex: 0,
            score: 0,
            answers: [],
            phase: 'PLAYING',
            startTime: Date.now()
        }));
    };

    const answerQuestion = (questionId, selectedOption, correctOption) => {
        const isCorrect = selectedOption === correctOption;
        setGameState(prev => {
            const newScore = isCorrect ? prev.score + 1 : prev.score;
            const newAnswers = [...prev.answers, { questionId, selectedOption, isCorrect }];

            return {
                ...prev,
                score: newScore,
                answers: newAnswers
            };
        });
    };

    const nextQuestion = () => {
        setGameState(prev => {
            const nextIndex = prev.currentQuestionIndex + 1;
            if (nextIndex >= prev.questions.length) {
                return { ...prev, phase: 'RESULT', endTime: Date.now() };
            }
            return { ...prev, currentQuestionIndex: nextIndex };
        });
    };

    const resetGame = () => {
        setGameState(prev => ({
            ...prev,
            phase: 'LOGIN',
            questions: [],
            currentQuestionIndex: 0,
            score: 0,
            answers: [],
            userId: null
        }));
    }

    const restartWithSameUser = () => {
        setGameState(prev => ({
            ...prev,
            phase: 'LOADING',
            questions: [],
            currentQuestionIndex: 0,
            score: 0,
            answers: [],
        }));
    }

    return (
        <GameContext.Provider value={{
            gameState,
            error,
            setError,
            setPhase,
            login,
            startGame,
            answerQuestion,
            nextQuestion,
            resetGame,
            restartWithSameUser
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
