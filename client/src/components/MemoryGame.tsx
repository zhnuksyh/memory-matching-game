import { useEffect, useRef, useState } from "react";
import { GameTile } from "./GameTile";
import { GameStats } from "./GameStats";
import { GameMenu } from "./GameMenu";
import { VictoryModal } from "./VictoryModal";
import { useMemoryGame } from "../lib/stores/useMemoryGame";
import { generateGameBoard } from "../lib/gameUtils";
import { GameLevel } from "../App";
import { useAudio } from "../lib/stores/useAudio";
import { Button } from "./ui/button";
import { RotateCcw, Pause, Play, Menu, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import gsap from "gsap";

interface MemoryGameProps {
  level: GameLevel;
  onComplete: () => void;
  onMainMenu: () => void;
  onHighScores: () => void;
}

export function MemoryGame({
  level,
  onComplete,
  onMainMenu,
  onHighScores,
}: MemoryGameProps) {
  const {
    gameState,
    tiles,
    flippedTiles,
    matchedTiles,
    moves,
    timeElapsed,
    isGameActive,
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
    flipTile,
    initializeGame,
    score,
  } = useMemoryGame();

  const { playHit, playSuccess } = useAudio();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [isReturningFromHighScores, setIsReturningFromHighScores] =
    useState(false);

  // Initialize game when level changes (but only if game is not already in progress)
  useEffect(() => {
    if (
      gameState === "ready" &&
      tiles.length === 0 &&
      !isReturningFromHighScores
    ) {
      const gameBoard = generateGameBoard(level.pairs);
      initializeGame(gameBoard, level);
    }
  }, [
    level,
    initializeGame,
    gameState,
    tiles.length,
    isReturningFromHighScores,
  ]);

  // Detect when returning from high scores
  useEffect(() => {
    if (gameState === "playing" && tiles.length > 0) {
      setIsReturningFromHighScores(true);
      // Reset the flag after a short delay
      const timer = setTimeout(() => {
        setIsReturningFromHighScores(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [gameState, tiles.length]);

  // Start game animation
  useEffect(() => {
    if (gameState === "playing" && gameContainerRef.current) {
      const tiles = gameContainerRef.current.querySelectorAll(".game-tile");

      gsap.fromTo(
        tiles,
        {
          scale: 0,
          rotation: 180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [gameState]);

  // Check for game completion
  useEffect(() => {
    if (matchedTiles.length === tiles.length && tiles.length > 0) {
      playSuccess();

      // Celebration animation
      if (gameContainerRef.current) {
        const tileElements =
          gameContainerRef.current.querySelectorAll(".game-tile");
        gsap.to(tileElements, {
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          stagger: 0.02,
        });
      }

      setTimeout(() => {
        setShowVictoryModal(true);
      }, 2000);
    }
  }, [matchedTiles.length, tiles.length, playSuccess]);

  const handleTileClick = (index: number) => {
    if (
      flippedTiles.length >= 2 ||
      flippedTiles.includes(index) ||
      matchedTiles.includes(index) ||
      gameState !== "playing"
    ) {
      return;
    }

    playHit();
    flipTile(index);
  };

  const handleStartGame = () => {
    startGame();
  };

  const handleResetGame = () => {
    resetGame();
    const gameBoard = generateGameBoard(level.pairs);
    initializeGame(gameBoard, level);
  };

  const handlePauseResume = () => {
    if (isGameActive) {
      pauseGame();
    } else {
      resumeGame();
    }
  };

  const handleVictoryModalClose = () => {
    setShowVictoryModal(false);
    onComplete();
  };

  const handlePlayAgain = () => {
    setShowVictoryModal(false);
    handleResetGame();
  };

  const getCurrentScore = () => {
    return score;
  };

  const gridCols =
    level.size === 5
      ? "grid-cols-5"
      : level.size === 6
      ? "grid-cols-6"
      : "grid-cols-8";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 h-full flex flex-col">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onMainMenu}
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <Badge
            variant="outline"
            className="bg-white/20 border-white/30 text-white"
          >
            {level.name} - {level.size}×{level.size}
          </Badge>
          <Badge
            variant="outline"
            className="bg-white/20 border-white/30 text-white"
          >
            {level.pairs} Pairs
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleResetGame}
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          {gameState !== "ready" && (
            <GameMenu
              isGameActive={isGameActive}
              onMainMenu={onMainMenu}
              onHighScores={onHighScores}
              onPauseResume={handlePauseResume}
              onAutoPause={pauseGame}
            />
          )}
        </div>
      </div>

      {/* Game Stats */}
      <GameStats
        moves={moves}
        timeElapsed={timeElapsed}
        matchedPairs={matchedTiles.length / 2}
        totalPairs={level.pairs}
        gameState={gameState}
        score={score}
      />

      {/* Start Screen */}
      {gameState === "ready" && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="text-center p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to play {level.name} level?
            </h3>
            <p className="text-white/80 mb-6">
              Find all {level.pairs} matching pairs in the {level.size}×
              {level.size} grid!
            </p>
            <Button
              onClick={handleStartGame}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Game Board */}
      {gameState !== "ready" && (
        <div className="relative">
          <div
            ref={gameContainerRef}
            className={`grid ${gridCols} gap-1 p-2 bg-white/5 rounded-lg backdrop-blur-sm`}
            style={{
              aspectRatio: "1",
              maxHeight: "60vh",
              maxWidth: "100%",
            }}
          >
            {tiles.map((tile, index) => (
              <GameTile
                key={index}
                tile={tile}
                index={index}
                isFlipped={
                  flippedTiles.includes(index) || matchedTiles.includes(index)
                }
                isMatched={matchedTiles.includes(index)}
                onClick={() => handleTileClick(index)}
                disabled={!isGameActive}
              />
            ))}
          </div>
        </div>
      )}

      {/* Victory Modal */}
      <VictoryModal
        isOpen={showVictoryModal}
        onClose={handleVictoryModalClose}
        onMainMenu={onMainMenu}
        onPlayAgain={handlePlayAgain}
        level={level}
        stats={{
          moves,
          timeElapsed,
          score: getCurrentScore(),
        }}
      />
    </div>
  );
}
