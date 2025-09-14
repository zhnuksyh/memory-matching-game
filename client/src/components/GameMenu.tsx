import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Menu, Home, Trophy, Pause, Play } from "lucide-react";

interface GameMenuProps {
  isGameActive: boolean;
  onMainMenu: () => void;
  onHighScores: () => void;
  onPauseResume: () => void;
  onAutoPause?: () => void;
}

export function GameMenu({
  isGameActive,
  onMainMenu,
  onHighScores,
  onPauseResume,
  onAutoPause,
}: GameMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsOpen(true);
    // Auto-pause the game when menu is opened
    if (isGameActive && onAutoPause) {
      onAutoPause();
    }
  };

  const handleMainMenu = () => {
    setIsOpen(false);
    onMainMenu();
  };

  const handleHighScores = () => {
    setIsOpen(false);
    onHighScores();
  };

  const handlePauseResume = () => {
    setIsOpen(false);
    onPauseResume();
  };

  return (
    <>
      {/* Menu Button */}
      <Button
        onClick={handleOpenMenu}
        variant="outline"
        size="sm"
        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Menu Dialog */}
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-white/20 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-800">
              Game Menu
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Button
              onClick={handleMainMenu}
              variant="outline"
              className="w-full justify-start bg-white/50 hover:bg-white/70 text-gray-800"
            >
              <Home className="w-4 h-4 mr-2" />
              Main Menu
            </Button>

            <Button
              onClick={handlePauseResume}
              variant="outline"
              className="w-full justify-start bg-white/50 hover:bg-white/70 text-gray-800"
            >
              {isGameActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Game
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume Game
                </>
              )}
            </Button>

            <Button
              onClick={handleHighScores}
              variant="outline"
              className="w-full justify-start bg-white/50 hover:bg-white/70 text-gray-800"
            >
              <Trophy className="w-4 h-4 mr-2" />
              High Scores
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
