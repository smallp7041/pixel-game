import React, { useEffect, useState } from 'react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import Avatar from '../components/Avatar';
import { useGame } from '../context/GameContext';
import { submitScore } from '../services/api';

const ResultPage = () => {
    const { gameState, resetGame } = useGame();
    const { score, questions, userId, answers } = gameState;
    const [submitting, setSubmitting] = useState(true);
    const [submitError, setSubmitError] = useState(null);

    const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD) || 3;
    const isPass = score >= PASS_THRESHOLD;

    useEffect(() => {
        const sendResults = async () => {
            try {
                // Prepare data for Google Apps Script
                const data = {
                    action: 'submitScore', // Convention for GAS routing
                    userId,
                    score,
                    totalQuestions: questions.length,
                    passed: isPass,
                    timestamp: new Date().toISOString()
                };

                await submitScore(data);
                setSubmitting(false);
            } catch (err) {
                console.error(err);
                setSubmitError("Failed to save score. But good game!");
                setSubmitting(false);
            }
        };

        if (userId) {
            sendResults();
        } else {
            setSubmitting(false); // Should not happen usually
        }
    }, [userId, score, questions, isPass]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <PixelCard title={isPass ? "MISSION COMPLETE" : "GAME OVER"}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <Avatar seed={isPass ? "happy-winner" : "sad-loser"} size={120} />

                    <div style={{ fontSize: '1.5rem', margin: '20px 0' }}>
                        SCORE: <span style={{ color: 'var(--pixel-primary)' }}>{score}</span> / {questions.length}
                    </div>

                    <p style={{ lineHeight: '1.6' }}>
                        {isPass
                            ? "Congratulations! You have mastered the Pixel World."
                            : "Don't give up! Try again to unlock your potential."}
                    </p>

                    {submitting && <p style={{ fontSize: '0.8rem', color: '#aaa' }}>SAVING SCORE...</p>}
                    {submitError && <p style={{ fontSize: '0.8rem', color: 'red' }}>{submitError}</p>}

                    <PixelButton onClick={resetGame} style={{ marginTop: '20px' }}>
                        PLAY AGAIN?
                    </PixelButton>
                </div>
            </PixelCard>
        </div>
    );
};

export default ResultPage;
