import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { FolderOpen, Loader2 } from "lucide-react";
import { useState } from "react";

export function ScanView() {
  const [path, setPath] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshProgress, setView } = useApp();

  const handleScan = async () => {
    if (!path) return;

    setScanning(true);
    setError(null);

    try {
      const count = await api.scanDirectory(path);
      await refreshProgress();
      if (count > 0) {
        setView("rank");
      } else {
        setError("No supported images found in that directory.");
      }
    } catch (err) {
      setError("Failed to scan directory. Please check the path.");
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Wallpaper Ranker
          </h1>
          <p className="text-muted-foreground">
            Enter the path to your wallpaper collection to begin ranking.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <FolderOpen className="h-5 w-5" />
            </div>
            <Input
              placeholder="/home/user/wallpapers"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              className="pl-10 h-12 text-lg bg-secondary/50 border-transparent focus:border-primary focus:ring-0 transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive animate-in slide-in-from-top-2">
              {error}
            </p>
          )}

          <Button
            className="w-full h-12 text-lg font-medium transition-all"
            onClick={handleScan}
            disabled={scanning || !path}
            size="lg"
          >
            {scanning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Scanning Collection...
              </>
            ) : (
              "Start Ranking"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
