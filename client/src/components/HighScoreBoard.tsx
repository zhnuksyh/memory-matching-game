import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Trophy, Clock, MousePointer, Medal, ArrowLeft } from "lucide-react";
import { GameLevel } from "../App";
import { getLocalStorage } from "../lib/utils";

interface HighScore {
  score: number;
  moves: number;
  time: number;
  date: string;
}

interface HighScoreBoardProps {
  levels: GameLevel[];
  onBack?: () => void;
}

export function HighScoreBoard({ levels, onBack }: HighScoreBoardProps) {
  const [highScores, setHighScores] = useState<Record<string, HighScore[]>>({});

  useEffect(() => {
    const loadHighScores = () => {
      const scores: Record<string, HighScore[]> = {};
      levels.forEach((level) => {
        const levelScores = getLocalStorage(`highScores_${level.name}`) || [];
        scores[level.name] = levelScores;
      });
      setHighScores(scores);
    };

    loadHighScores();
  }, [levels]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-white/60 font-bold">
            {index + 1}
          </span>
        );
    }
  };

  const getLevelColor = (levelName: string) => {
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

  const hasAnyScores = Object.values(highScores).some(
    (scores) => scores.length > 0
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Back Button */}
      {onBack && (
        <div className="mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🏆 High Scores 🏆
        </h2>
        <p className="text-white/80">
          Your best performances across all difficulty levels
        </p>
      </div>

      {!hasAnyScores ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="text-center p-12">
            <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No High Scores Yet
            </h3>
            <p className="text-white/60">
              Complete a game to see your scores appear here!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={levels[0].name} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            {levels.map((level) => (
              <TabsTrigger
                key={level.name}
                value={level.name}
                className="data-[state=active]:bg-white/20 text-white"
              >
                {level.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {levels.map((level) => (
            <TabsContent key={level.name} value={level.name} className="mt-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${getLevelColor(
                          level.name
                        )} flex items-center justify-center`}
                      >
                        <span className="text-white font-bold">
                          {level.name.charAt(0)}
                        </span>
                      </div>
                      {level.name} Level
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white"
                    >
                      {level.size}×{level.size}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {highScores[level.name]?.length > 0 ? (
                    <div className="space-y-3">
                      {highScores[level.name]
                        .slice(0, 10)
                        .map((score, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-8">
                                {getMedalIcon(index)}
                              </div>
                              <div className="text-white">
                                <div className="font-semibold text-lg">
                                  {score.score.toLocaleString()} pts
                                </div>
                                <div className="text-sm text-white/60">
                                  {formatDate(score.date)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-white/80">
                              <div className="text-center">
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatTime(score.time)}</span>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center gap-1 text-sm">
                                  <MousePointer className="w-4 h-4" />
                                  <span>{score.moves}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p>No scores recorded for this level yet.</p>
                      <p className="text-sm">
                        Play the {level.name} level to set your first record!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
