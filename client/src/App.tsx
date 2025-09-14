import { useState, useEffect } from "react";
import { MemoryGame } from "./components/MemoryGame";
import { LevelSelector } from "./components/LevelSelector";
import { HighScoreBoard } from "./components/HighScoreBoard";
import { useMemoryGame } from "./lib/stores/useMemoryGame";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Trophy, Play, RotateCcw } from "lucide-react";
import "@fontsource/poppins";

export type GameLevel = {
  name: string;
  size: number;
  pairs: number;
};

export const GAME_LEVELS: GameLevel[] = [
  { name: "Easy", size: 5, pairs: 12 },
  { name: "Medium", size: 6, pairs: 18 },
  { name: "Hard", size: 8, pairs: 32 },
];

function App() {
  const {
    gameState,
    currentLevel,
    setLevel,
    resetGame,
    showHighScores,
    setShowHighScores,
    resumeGame,
  } = useMemoryGame();

  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [previousScreen, setPreviousScreen] = useState<"menu" | "game">("menu");

  const handleLevelSelect = (level: GameLevel) => {
    setLevel(level);
    setShowLevelSelect(false);
    setShowHighScores(false);
  };

  const handleBackToMenu = () => {
    resetGame();
    setShowLevelSelect(true);
    setShowHighScores(false);
    setPreviousScreen("menu");
  };

  const handleShowHighScoresFromMenu = () => {
    setPreviousScreen("menu");
    setShowHighScores(true);
    setShowLevelSelect(false);
  };

  const handleShowHighScoresFromGame = () => {
    setPreviousScreen("game");
    setShowHighScores(true);
    setShowLevelSelect(false);
  };

  const handleBackFromHighScores = () => {
    setShowHighScores(false);
    if (previousScreen === "game") {
      // Return to game (don't reset game state)
      setShowLevelSelect(false);
      // Resume the game if it was paused (game gets paused when menu is opened)
      if (gameState === "playing") {
        resumeGame();
      }
    } else {
      // Return to main menu
      setShowLevelSelect(true);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-4 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full">
        {/* Header - Only show when not in game */}
        {showLevelSelect && (
          <>
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
                onClick={handleShowHighScoresFromMenu}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Trophy className="w-4 h-4 mr-2" />
                High Scores
              </Button>
            </div>
          </>
        )}

        {/* Main Content */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 h-full flex flex-col">
          {showLevelSelect ? (
            <LevelSelector
              levels={GAME_LEVELS}
              onLevelSelect={handleLevelSelect}
            />
          ) : showHighScores ? (
            <HighScoreBoard
              levels={GAME_LEVELS}
              onBack={handleBackFromHighScores}
            />
          ) : (
            <MemoryGame
              level={currentLevel!}
              onComplete={() => setShowLevelSelect(true)}
              onMainMenu={handleBackToMenu}
              onHighScores={handleShowHighScoresFromGame}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
