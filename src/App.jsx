import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';

const GameContainer = () => {
  const { gameState } = useGame();

  switch (gameState.phase) {
    case 'PLAYING':
      return <GamePage />;
    case 'RESULT':
      return <ResultPage />;
    case 'LOADING':
      return <div className="loading-screen">LOADING PIXEL WORLD...</div>; // Simple loading text
    case 'LOGIN':
    default:
      return <LoginPage />;
  }
};

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;
