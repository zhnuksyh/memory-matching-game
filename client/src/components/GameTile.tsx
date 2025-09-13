import { useRef, useEffect } from "react";
import { GameTile as GameTileType } from "../lib/gameUtils";
import { Card, CardContent } from "./ui/card";
import gsap from "gsap";

interface GameTileProps {
  tile: GameTileType;
  index: number;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled: boolean;
}

export function GameTile({ 
  tile, 
  index, 
  isFlipped, 
  isMatched, 
  onClick, 
  disabled 
}: GameTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const wasFlipped = useRef(isFlipped);

  // Animate flip when state changes
  useEffect(() => {
    if (tileRef.current && wasFlipped.current !== isFlipped) {
      const tl = gsap.timeline();
      
      tl.to(tileRef.current, {
        rotationY: 90,
        duration: 0.15,
        ease: "power2.in"
      })
      .set(tileRef.current, {
        rotationY: -90
      })
      .to(tileRef.current, {
        rotationY: 0,
        duration: 0.15,
        ease: "power2.out"
      });

      wasFlipped.current = isFlipped;
    }
  }, [isFlipped]);

  // Match animation
  useEffect(() => {
    if (isMatched && tileRef.current) {
      gsap.to(tileRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.7)",
        yoyo: true,
        repeat: 1
      });
    }
  }, [isMatched]);

  // Hover animation
  const handleMouseEnter = () => {
    if (!disabled && !isFlipped && tileRef.current) {
      gsap.to(tileRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && !isFlipped && tileRef.current) {
      gsap.to(tileRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const getBackgroundColor = () => {
    if (isMatched) return tile.color + "/20";
    if (isFlipped) return tile.color;
    return "white/10";
  };

  const getBorderColor = () => {
    if (isMatched) return tile.color;
    if (isFlipped) return "white/30";
    return "white/20";
  };

  const getTextColor = () => {
    if (isFlipped || isMatched) return "white";
    return "transparent";
  };

  return (
    <Card
      ref={tileRef}
      className={`game-tile aspect-square cursor-pointer transition-all duration-200 bg-${getBackgroundColor()} border-${getBorderColor()} hover:shadow-lg ${
        disabled ? 'cursor-not-allowed' : ''
      }`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: isFlipped || isMatched ? tile.color : undefined,
        borderColor: isMatched ? tile.color : undefined
      }}
    >
      <CardContent className="p-0 flex items-center justify-center h-full">
        <span 
          className={`text-2xl font-bold transition-opacity duration-200 ${
            isFlipped || isMatched ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            color: isFlipped || isMatched ? 'white' : 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {tile.symbol}
        </span>
      </CardContent>
    </Card>
  );
}
