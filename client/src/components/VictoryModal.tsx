import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { Trophy, Clock, MousePointer, Star } from "lucide-react";
import Confetti from "react-confetti";

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMainMenu: () => void;
  onPlayAgain: () => void;
  level: {
    name: string;
    size: number;
    pairs: number;
  };
  stats: {
    moves: number;
    timeElapsed: number;
    score: number;
  };
}

export function VictoryModal({
  isOpen,
  onClose,
  onMainMenu,
  onPlayAgain,
  level,
  stats,
}: VictoryModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreRating = (score: number, pairs: number) => {
    const maxPossibleScore = pairs * 30; // 30 points per pair
    const percentage =
      maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0;

    if (percentage >= 90)
      return { rating: "Perfect!", color: "text-yellow-400", stars: 3 };
    if (percentage >= 75)
      return { rating: "Excellent!", color: "text-green-400", stars: 2 };
    if (percentage >= 60)
      return { rating: "Good!", color: "text-blue-400", stars: 1 };
    return { rating: "Nice Try!", color: "text-purple-400", stars: 0 };
  };

  const rating = getScoreRating(stats.score, level.pairs);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          initialVelocityY={20}
          colors={[
            "#FFD700",
            "#FFA500",
            "#FF6347",
            "#32CD32",
            "#1E90FF",
            "#9370DB",
          ]}
        />
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-purple-600/95 to-teal-500/95 backdrop-blur-sm border-white/20 max-w-md">
          <div className="text-center space-y-6">
            {/* Victory Header */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Congratulations!
              </h2>
              <p className="text-white/80 text-lg">
                You completed the {level.name} level!
              </p>
            </div>

            {/* Score Rating */}
            <div className="space-y-2">
              <p className={`text-2xl font-bold ${rating.color}`}>
                {rating.rating}
              </p>
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < rating.stars
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-center">
                  Final Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score Display */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {stats.score.toLocaleString()}
                  </div>
                  <div className="text-white/80">Total Score</div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="text-white/80 text-sm">Time</span>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {formatTime(stats.timeElapsed)}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <MousePointer className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-white/80 text-sm">Moves</span>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {stats.moves}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onMainMenu}
                variant="outline"
                className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Main Menu
              </Button>
              <Button
                onClick={onPlayAgain}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold"
              >
                Play Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
