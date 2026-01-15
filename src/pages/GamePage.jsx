import React, { useState, useEffect } from 'react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import Avatar from '../components/Avatar';
import { useGame } from '../context/GameContext';

const GamePage = () => {
    const { gameState, answerQuestion, nextQuestion } = useGame();
    const { questions, currentQuestionIndex } = gameState;
    const currentQuestion = questions[currentQuestionIndex];

    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false); // Immediate feedback before storing

    // Reset local state when question changes
    useEffect(() => {
        setSelectedOption(null);
        setShowResult(false);
    }, [currentQuestionIndex]);

    const handleOptionClick = (option) => {
        if (selectedOption) return; // Prevent double click
        setSelectedOption(option);
        setShowResult(true);

        // Wait a bit to show feedback then move next
        setTimeout(() => {
            answerQuestion(currentQuestion.id, option, currentQuestion.answer); // Assuming question has 'answer' field
            nextQuestion();
        }, 1000);
    };

    if (!currentQuestion) return <div>Loading...</div>;

    const progress = Math.round(((currentQuestionIndex) / questions.length) * 100);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: '20px', border: '2px solid white', height: '20px', padding: '2px' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--pixel-primary)', transition: 'width 0.3s' }}></div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '10px', fontSize: '0.8rem' }}>
                STAGE {currentQuestionIndex + 1}/{questions.length}
            </div>

            <PixelCard>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    <Avatar seed={currentQuestion.id + currentQuestion.question} size={80} />
                </div>

                <h3 style={{ textAlign: 'center', lineHeight: '1.6', marginBottom: '30px', minHeight: '60px' }}>
                    {currentQuestion.question}
                </h3>

                <div style={{ display: 'grid', gap: '15px' }}>
                    {currentQuestion.options.map((option, idx) => {
                        let variant = 'primary';
                        if (showResult && option === selectedOption) {
                            // Simple feedback: Highlight selected. 
                            // We don't necessarily show correct answer immediately depending on game design, 
                            // but usually green/red is good. 
                            // For now just highlight selection.
                            variant = 'secondary';
                        }

                        return (
                            <PixelButton
                                key={idx}
                                onClick={() => handleOptionClick(option)}
                                disabled={!!selectedOption}
                                variant={variant}
                                className="option-btn"
                            >
                                {option}
                            </PixelButton>
                        )
                    })}
                </div>
            </PixelCard>
        </div>
    );
};

export default GamePage;
