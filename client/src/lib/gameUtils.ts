export interface GameTile {
  id: number;
  pairId: number;
  symbol: string;
  color: string;
}

const SYMBOLS = ['🎯', '🎪', '🎨', '🎭', '🎸', '🎹', '🎺', '🎻', '🎲', '🎰', '🎳', '🎯', 
                '🚀', '🚁', '🚂', '🚗', '🚙', '🚌', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕',
                '⭐', '⚡', '🔥', '❄️', '🌟', '🎀', '🎁', '💎', '🏆', '🎊', '🎉', '🌈',
                '🦄', '🐻', '🐱', '🐶', '🐸', '🦊', '🐨', '🐼', '🦁', '🐯', '🐮', '🐷',
                '🍕', '🍔', '🍟', '🌭', '🍿', '🎂', '🍰', '🧁', '🍪', '🍩', '🍭', '🍬'];

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9'
];

export function generateGameBoard(pairCount: number): GameTile[] {
  const usedSymbols = SYMBOLS.slice(0, pairCount);
  const usedColors = COLORS.slice(0, pairCount);
  
  const tiles: GameTile[] = [];
  let tileId = 0;

  // Create pairs
  for (let i = 0; i < pairCount; i++) {
    const symbol = usedSymbols[i];
    const color = usedColors[i % usedColors.length];

    // Add two tiles with the same pairId
    tiles.push({
      id: tileId++,
      pairId: i,
      symbol,
      color
    });
    
    tiles.push({
      id: tileId++,
      pairId: i,
      symbol,
      color
    });
  }

  // Shuffle the tiles using Fisher-Yates algorithm
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  return tiles;
}

export function calculateScore(moves: number, timeElapsed: number): number {
  const baseScore = 10000;
  const movePenalty = moves * 50;
  const timePenalty = timeElapsed * 10;
  
  return Math.max(0, baseScore - movePenalty - timePenalty);
}
