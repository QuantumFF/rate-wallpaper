import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { api, type Wallpaper } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  SkipForward,
  StopCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function RankView() {
  const [pair, setPair] = useState<[Wallpaper, Wallpaper] | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<"left" | "right" | null>(null);
  const { progress, refreshProgress, setView } = useApp();

  const fetchPair = useCallback(async () => {
    setLoading(true);
    try {
      const newPair = await api.getPair();
      setPair(newPair);
    } catch (error) {
      console.error("Failed to fetch pair:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPair();
  }, [fetchPair]);

  const handleVote = async (
    winner: Wallpaper,
    loser: Wallpaper,
    side: "left" | "right",
  ) => {
    if (voting) return; // Prevent double voting
    setVoting(side);

    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      await api.vote(winner.id, loser.id);
      await refreshProgress();
      setVoting(null);
      await fetchPair();
    } catch (error) {
      console.error("Failed to submit vote:", error);
      setVoting(null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pair || loading || voting) return;

      if (e.key === "ArrowLeft") {
        void handleVote(pair[0], pair[1], "left");
      } else if (e.key === "ArrowRight") {
        void handleVote(pair[1], pair[0], "right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pair, loading, voting]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!pair && loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!pair) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Error loading wallpapers.
      </div>
    );
  }

  const [left, right] = pair;

  return (
    <div className="flex flex-col flex-1 h-full w-full max-w-[1920px] mx-auto p-4 min-h-0">
      <div className="flex-1 flex flex-col justify-center gap-4 w-full">
        {/* Progress Header */}
        <div className="w-full max-w-2xl mx-auto space-y-1">
          <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Progress</span>
            <span>{progress?.percentage.toFixed(1)}%</span>
          </div>
          <Progress value={progress?.percentage || 0} className="h-1" />
        </div>

        {/* Comparison Area */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 items-center">
          {/* Left Option */}
          <div
            className={`relative w-full aspect-video group cursor-pointer transition-all duration-300 rounded-xl ${voting === "right" ? "opacity-50 scale-95 grayscale" : ""} ${voting === "left" ? "ring-4 ring-primary scale-[1.02]" : "hover:scale-[1.01]"}`}
            onClick={() => handleVote(left, right, "left")}
          >
            <div className="absolute inset-0 bg-card rounded-xl overflow-hidden border border-border shadow-sm">
              <img
                src={api.getImageUrl(left.id)}
                alt="Left Wallpaper"
                className="object-cover w-full h-full bg-black/20"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm font-medium transition-opacity shadow-lg">
                  Select Left
                </span>
              </div>
              {/* Vote Feedback */}
              {voting === "left" && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-in fade-in duration-200">
                  <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-xl">
                    <ArrowLeft className="h-8 w-8" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Option */}
          <div
            className={`relative w-full aspect-video group cursor-pointer transition-all duration-300 rounded-xl ${voting === "left" ? "opacity-50 scale-95 grayscale" : ""} ${voting === "right" ? "ring-4 ring-primary scale-[1.02]" : "hover:scale-[1.01]"}`}
            onClick={() => handleVote(right, left, "right")}
          >
            <div className="absolute inset-0 bg-card rounded-xl overflow-hidden border border-border shadow-sm">
              <img
                src={api.getImageUrl(right.id)}
                alt="Right Wallpaper"
                className="object-cover w-full h-full bg-black/20"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm font-medium transition-opacity shadow-lg">
                  Select Right
                </span>
              </div>
              {/* Vote Feedback */}
              {voting === "right" && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-in fade-in duration-200">
                  <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-xl">
                    <ArrowRight className="h-8 w-8" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-center items-center gap-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("review")}
          className="text-muted-foreground hover:text-foreground"
        >
          <StopCircle className="mr-2 h-4 w-4" />
          Stop & Review
        </Button>

        <div className="h-4 w-px bg-border" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchPair()}
          disabled={loading || voting !== null}
          className="text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="mr-2 h-4 w-4" />
          Skip Pair
        </Button>
      </div>

      {/* Keyboard Hints */}
      <div className="hidden md:flex justify-between px-8 text-[10px] text-muted-foreground opacity-50">
        <span>← Left Arrow</span>
        <span>Right Arrow →</span>
      </div>
    </div>
  );
}
