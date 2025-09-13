import { useState, useEffect } from "react";
import { MemoryGame } from "./components/MemoryGame";
import { LevelSelector } from "./components/LevelSelector";
import { HighScoreBoard } from "./components/HighScoreBoard";
import { useMemoryGame } from "./lib/stores/useMemoryGame";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Trophy, Play, RotateCcw } from "lucide-react";
import "@fontsource/inter";

export type GameLevel = {
  name: string;
  size: number;
  pairs: number;
};

export const GAME_LEVELS: GameLevel[] = [
  { name: "Easy", size: 8, pairs: 32 },
  { name: "Medium", size: 10, pairs: 50 },
  { name: "Hard", size: 12, pairs: 72 }
];

function App() {
  const { 
    gameState, 
    currentLevel, 
    setLevel, 
    resetGame,
    showHighScores,
    setShowHighScores 
  } = useMemoryGame();
  
  const [showLevelSelect, setShowLevelSelect] = useState(true);

  const handleLevelSelect = (level: GameLevel) => {
    setLevel(level);
    setShowLevelSelect(false);
    setShowHighScores(false);
  };

  const handleBackToMenu = () => {
    resetGame();
    setShowLevelSelect(true);
    setShowHighScores(false);
  };

  const handleShowHighScores = () => {
    setShowHighScores(true);
    setShowLevelSelect(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Memory Match
          </h1>
          <p className="text-xl text-white/80">
            Match the pairs and beat your best time!
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={handleBackToMenu}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Play className="w-4 h-4 mr-2" />
            New Game
          </Button>
          <Button
            onClick={handleShowHighScores}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Trophy className="w-4 h-4 mr-2" />
            High Scores
          </Button>
        </div>

        {/* Main Content */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
          {showLevelSelect ? (
            <LevelSelector 
              levels={GAME_LEVELS} 
              onLevelSelect={handleLevelSelect}
            />
          ) : showHighScores ? (
            <HighScoreBoard levels={GAME_LEVELS} />
          ) : (
            <MemoryGame 
              level={currentLevel!} 
              onComplete={() => setShowLevelSelect(true)}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
