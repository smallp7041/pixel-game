import React, { useState } from 'react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { useGame } from '../context/GameContext';
import { fetchQuestions } from '../services/api';

const ErrorDisplay = () => {
    const { error } = useGame();
    if (!error) return null;
    return (
        <div style={{ color: 'red', marginTop: '10px', fontSize: '0.7rem', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px' }}>
            ! {error} !
        </div>
    )
}

const LoginPage = () => {
    const [inputID, setInputID] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, startGame, setError } = useGame(); // Error is used in sub-component now

    const handleStart = async (e) => {
        e.preventDefault();
        if (!inputID.trim()) return;

        setLoading(true);
        login(inputID);

        try {
            const count = import.meta.env.VITE_QUESTION_COUNT || 5;
            const questions = await fetchQuestions(count);
            startGame(questions);
        } catch (err) {
            console.error("Login Error Details:", err);
            setError(`GAME LOAD FAILED: ${err.message || 'UNKNOWN ERROR'}. CHECK CONSOLE.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', color: 'var(--pixel-primary)', textShadow: '4px 4px #000', marginBottom: '40px', fontSize: '2rem' }}>
                PIXEL QUIZ
            </h1>

            <PixelCard title="PLAYER ENTRY">
                <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', color: '#aaa' }}>ENTER PLAYER ID:</label>
                        <input
                            type="text"
                            value={inputID}
                            onChange={(e) => setInputID(e.target.value)}
                            placeholder="A123"
                            style={{
                                padding: '12px',
                                fontFamily: 'var(--font-pixel)',
                                backgroundColor: '#2d1b2e',
                                border: '2px solid var(--pixel-border)',
                                color: 'white',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <PixelButton disabled={loading || !inputID.trim()} type="submit" style={{ width: '100%' }}>
                        {loading ? "LOADING..." : "INSERT COIN (START)"}
                    </PixelButton>

                    {/* Show Error if exists */}
                    {/* We need to use 'useGame' context visible error if possible or local state? 
                         Context has 'gameState' and 'error'. We destructured 'setError' but where is 'error' used?
                         It wasn't exposed in the login page properly. Let's pull it from context.
                     */}
                </form>
                <ErrorDisplay />
            </PixelCard>

            <p style={{ marginTop: '20px', fontSize: '0.7rem', color: '#666' }}>© 2026 PIXEL CORP</p>
        </div>
    );
};

export default LoginPage;
