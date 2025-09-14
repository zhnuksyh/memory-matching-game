import { GameLevel } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Grid, Target } from "lucide-react";

interface LevelSelectorProps {
  levels: GameLevel[];
  onLevelSelect: (level: GameLevel) => void;
}

export function LevelSelector({ levels, onLevelSelect }: LevelSelectorProps) {
  const getDifficultyColor = (levelName: string) => {
    switch (levelName.toLowerCase()) {
      case "easy":
        return "from-green-400 to-emerald-500";
      case "medium":
        return "from-yellow-400 to-orange-500";
      case "hard":
        return "from-red-400 to-pink-500";
      default:
        return "from-blue-400 to-purple-500";
    }
  };

  const getEstimatedTime = (pairs: number) => {
    if (pairs <= 12) return "1-3 min";
    if (pairs <= 18) return "2-5 min";
    return "3-8 min";
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your Challenge
        </h2>
        <p className="text-white/80">
          Select a difficulty level to begin your memory challenge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {levels.map((level, index) => (
          <Card
            key={index}
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group"
            onClick={() => onLevelSelect(level)}
          >
            <CardHeader className="text-center pb-4">
              <div
                className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getDifficultyColor(
                  level.name
                )} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <Grid className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                {level.name}
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-white/20 border-white/30 text-white w-fit mx-auto"
              >
                {level.size} × {level.size}
              </Badge>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{level.pairs} pairs</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{getEstimatedTime(level.pairs)}</span>
                </div>
              </div>

              <Button
                className={`w-full bg-gradient-to-r ${getDifficultyColor(
                  level.name
                )} hover:opacity-90 text-white font-semibold transition-all duration-300 group-hover:shadow-lg`}
                size="lg"
              >
                Play {level.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
