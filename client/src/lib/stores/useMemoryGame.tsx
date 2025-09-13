import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GameTile } from "../gameUtils";
import { GameLevel } from "../../App";
import { getLocalStorage, setLocalStorage } from "../utils";

export type GameState = "ready" | "playing" | "paused" | "completed";

interface HighScore {
  score: number;
  moves: number;
  time: number;
  date: string;
}

interface MemoryGameState {
  gameState: GameState;
  currentLevel: GameLevel | null;
  tiles: GameTile[];
  flippedTiles: number[];
  matchedTiles: number[];
  moves: number;
  timeElapsed: number;
  startTime: number | null;
  isGameActive: boolean;
  showHighScores: boolean;

  // Actions
  setLevel: (level: GameLevel) => void;
  initializeGame: (tiles: GameTile[], level: GameLevel) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  flipTile: (index: number) => void;
  setShowHighScores: (show: boolean) => void;
}

export const useMemoryGame = create<MemoryGameState>()(
  subscribeWithSelector((set, get) => {
    let gameTimer: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (gameTimer) clearInterval(gameTimer);
      
      gameTimer = setInterval(() => {
        const { isGameActive, startTime, gameState } = get();
        if (isGameActive && startTime && gameState === "playing") {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          set({ timeElapsed: elapsed });
        }
      }, 1000);
    };

    const stopTimer = () => {
      if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
      }
    };

    const saveHighScore = (level: GameLevel, moves: number, timeElapsed: number) => {
      const score = Math.max(0, 10000 - (moves * 50) - (timeElapsed * 10));
      const newScore: HighScore = {
        score,
        moves,
        time: timeElapsed,
        date: new Date().toISOString()
      };

      const existingScores: HighScore[] = getLocalStorage(`highScores_${level.name}`) || [];
      existingScores.push(newScore);
      
      // Sort by score (highest first) and keep top 10
      existingScores.sort((a, b) => b.score - a.score);
      const topScores = existingScores.slice(0, 10);
      
      setLocalStorage(`highScores_${level.name}`, topScores);
    };

    return {
      gameState: "ready",
      currentLevel: null,
      tiles: [],
      flippedTiles: [],
      matchedTiles: [],
      moves: 0,
      timeElapsed: 0,
      startTime: null,
      isGameActive: false,
      showHighScores: false,

      setLevel: (level) => set({ currentLevel: level }),

      initializeGame: (tiles, level) => {
        stopTimer();
        set({
          tiles,
          currentLevel: level,
          gameState: "ready",
          flippedTiles: [],
          matchedTiles: [],
          moves: 0,
          timeElapsed: 0,
          startTime: null,
          isGameActive: false
        });
      },

      startGame: () => {
        const startTime = Date.now();
        set({
          gameState: "playing",
          startTime,
          isGameActive: true,
          timeElapsed: 0
        });
        startTimer();
      },

      pauseGame: () => {
        set({ isGameActive: false });
        stopTimer();
      },

      resumeGame: () => {
        const { startTime, timeElapsed } = get();
        const newStartTime = Date.now() - (timeElapsed * 1000);
        set({
          isGameActive: true,
          startTime: newStartTime
        });
        startTimer();
      },

      resetGame: () => {
        stopTimer();
        set({
          gameState: "ready",
          flippedTiles: [],
          matchedTiles: [],
          moves: 0,
          timeElapsed: 0,
          startTime: null,
          isGameActive: false
        });
      },

      flipTile: (index) => {
        const { flippedTiles, matchedTiles, moves, tiles, currentLevel } = get();

        if (flippedTiles.length >= 2 || flippedTiles.includes(index) || matchedTiles.includes(index)) {
          return;
        }

        const newFlippedTiles = [...flippedTiles, index];
        const newMoves = moves + 1;

        set({ 
          flippedTiles: newFlippedTiles, 
          moves: newMoves 
        });

        if (newFlippedTiles.length === 2) {
          const [firstIndex, secondIndex] = newFlippedTiles;
          const firstTile = tiles[firstIndex];
          const secondTile = tiles[secondIndex];

          setTimeout(() => {
            if (firstTile.pairId === secondTile.pairId) {
              // Match found
              const newMatchedTiles = [...matchedTiles, firstIndex, secondIndex];
              set({
                matchedTiles: newMatchedTiles,
                flippedTiles: []
              });

              // Check if game is completed
              if (newMatchedTiles.length === tiles.length) {
                stopTimer();
                const { timeElapsed } = get();
                
                if (currentLevel) {
                  saveHighScore(currentLevel, newMoves, timeElapsed);
                }
                
                set({ 
                  gameState: "completed",
                  isGameActive: false 
                });
              }
            } else {
              // No match, flip back
              set({ flippedTiles: [] });
            }
          }, 1000);
        }
      },

      setShowHighScores: (show) => set({ showHighScores: show })
    };
  })
);

// Cleanup timer when store is destroyed
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    // Timer cleanup is handled in the store methods
  });
}
