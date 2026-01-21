import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { api, type Wallpaper } from "@/lib/api";
import {
  ArrowLeft,
  Check,
  FolderInput,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function ReviewView() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [movePath, setMovePath] = useState("./rejected");
  const { setView } = useApp();

  const fetchReviewList = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.getReviewList(50);
      setWallpapers(list);
    } catch (error) {
      console.error("Failed to fetch review list:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReviewList();
  }, [fetchReviewList]);

  const handleKeep = (id: number) => {
    setWallpapers((prev) => prev.filter((w) => w.id !== id));
  };

  const handleMove = async (id: number) => {
    try {
      await api.moveWallpaper(id, movePath);
      setWallpapers((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Failed to move wallpaper:", error);
      alert("Failed to move wallpaper. Check console for details.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-[1920px] mx-auto p-6 gap-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-light tracking-tight">
            Review Low-Rated
          </h2>
          <p className="text-sm text-muted-foreground">
            Decide what to do with your lowest ranked wallpapers.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg border border-border">
            <span className="text-xs font-medium px-2 text-muted-foreground">
              Move to:
            </span>
            <Input
              value={movePath}
              onChange={(e) => setMovePath(e.target.value)}
              className="h-8 w-40 bg-background border-none shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            variant="outline"
            onClick={fetchReviewList}
            className="gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setView("rank")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      {wallpapers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
          <Check className="h-12 w-12 opacity-20" />
          <p>No wallpapers to review.</p>
          <Button variant="link" onClick={() => setView("rank")}>
            Return to Ranking
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-8">
          {wallpapers.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className="group relative aspect-video bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={api.getImageUrl(wallpaper.id, "small")}
                alt={wallpaper.filename}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />

              {/* Rating Badge */}
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className="bg-black/60 backdrop-blur-md text-white border-none"
                >
                  {wallpaper.rating_mu.toFixed(1)}
                </Badge>
              </div>

              {/* Hover Actions Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-[2px]">
                <p className="text-white text-xs font-medium truncate w-full text-center px-2 mb-2">
                  {wallpaper.filename}
                </p>
                <div className="flex gap-2 w-full max-w-[200px]">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none"
                    onClick={() => handleKeep(wallpaper.id)}
                  >
                    <Check className="mr-2 h-3 w-3" />
                    Keep
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <FolderInput className="mr-2 h-3 w-3" />
                        Move
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Move Wallpaper?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will move "{wallpaper.filename}" to "{movePath}".
                          It will be removed from the ranking database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleMove(wallpaper.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Move File
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
