import { useEffect, useRef } from "react";
import { GameTile } from "./GameTile";
import { GameStats } from "./GameStats";
import { useMemoryGame } from "../lib/stores/useMemoryGame";
import { generateGameBoard } from "../lib/gameUtils";
import { GameLevel } from "../App";
import { useAudio } from "../lib/stores/useAudio";
import { Button } from "./ui/button";
import { RotateCcw, Pause, Play } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import gsap from "gsap";

interface MemoryGameProps {
  level: GameLevel;
  onComplete: () => void;
}

export function MemoryGame({ level, onComplete }: MemoryGameProps) {
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
    initializeGame
  } = useMemoryGame();

  const { playHit, playSuccess } = useAudio();
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Initialize game when level changes
  useEffect(() => {
    const gameBoard = generateGameBoard(level.pairs);
    initializeGame(gameBoard, level);
  }, [level, initializeGame]);

  // Start game animation
  useEffect(() => {
    if (gameState === "playing" && gameContainerRef.current) {
      const tiles = gameContainerRef.current.querySelectorAll('.game-tile');
      
      gsap.fromTo(tiles, 
        { 
          scale: 0, 
          rotation: 180,
          opacity: 0 
        },
        { 
          scale: 1, 
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.out(1.7)"
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
        const tileElements = gameContainerRef.current.querySelectorAll('.game-tile');
        gsap.to(tileElements, {
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          stagger: 0.02
        });
      }
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [matchedTiles.length, tiles.length, playSuccess, onComplete]);

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

  const gridCols = level.size === 8 ? 'grid-cols-8' : 
                   level.size === 10 ? 'grid-cols-10' : 'grid-cols-12';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
            {level.name} - {level.size}×{level.size}
          </Badge>
          <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
            {level.pairs} Pairs
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {gameState === "playing" && (
            <Button
              onClick={handlePauseResume}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {isGameActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          )}
          <Button
            onClick={handleResetGame}
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Game Stats */}
      <GameStats 
        moves={moves}
        timeElapsed={timeElapsed}
        matchedPairs={matchedTiles.length / 2}
        totalPairs={level.pairs}
        gameState={gameState}
      />

      {/* Start Screen */}
      {gameState === "ready" && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="text-center p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to play {level.name} level?
            </h3>
            <p className="text-white/80 mb-6">
              Find all {level.pairs} matching pairs in the {level.size}×{level.size} grid!
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
          {/* Pause Overlay */}
          {!isGameActive && gameState === "playing" && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <Card className="bg-white/90">
                <CardContent className="text-center p-6">
                  <h3 className="text-xl font-bold mb-4">Game Paused</h3>
                  <Button onClick={handlePauseResume}>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <div 
            ref={gameContainerRef}
            className={`grid ${gridCols} gap-2 p-4 bg-white/5 rounded-lg backdrop-blur-sm`}
            style={{
              aspectRatio: '1',
              maxHeight: '70vh'
            }}
          >
            {tiles.map((tile, index) => (
              <GameTile
                key={index}
                tile={tile}
                index={index}
                isFlipped={flippedTiles.includes(index) || matchedTiles.includes(index)}
                isMatched={matchedTiles.includes(index)}
                onClick={() => handleTileClick(index)}
                disabled={!isGameActive}
              />
            ))}
          </div>
        </div>
      )}

      {/* Victory Message */}
      {gameState === "completed" && (
        <Card className="bg-gradient-to-r from-green-400/20 to-blue-500/20 backdrop-blur-sm border-green-400/30">
          <CardContent className="text-center p-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              🎉 Congratulations! 🎉
            </h3>
            <p className="text-white/80">
              You completed the {level.name} level in {moves} moves and {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
