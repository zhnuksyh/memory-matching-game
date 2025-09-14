import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, MousePointer, Target, Trophy } from "lucide-react";

interface GameStatsProps {
  moves: number;
  timeElapsed: number;
  matchedPairs: number;
  totalPairs: number;
  gameState: string;
  score: number;
}

export function GameStats({
  moves,
  timeElapsed,
  matchedPairs,
  totalPairs,
  gameState,
  score,
}: GameStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Time */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-white/80">Time</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatTime(timeElapsed)}
          </div>
        </CardContent>
      </Card>

      {/* Moves */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <MousePointer className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-sm font-medium text-white/80">Moves</span>
          </div>
          <div className="text-2xl font-bold text-white">{moves}</div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-sm font-medium text-white/80">Progress</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {matchedPairs}/{totalPairs}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Score */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-sm font-medium text-white/80">Score</span>
          </div>
          <div className="text-2xl font-bold text-white">{score}</div>
        </CardContent>
      </Card>
    </div>
  );
}
