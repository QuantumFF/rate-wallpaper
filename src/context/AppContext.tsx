/* eslint-disable react-refresh/only-export-components */
import type { ProgressStats, Wallpaper } from "@/lib/api";
import { api } from "@/lib/api";
import React, { createContext, useContext, useEffect, useState } from "react";

type View = "scan" | "rank" | "review";

interface AppContextType {
  view: View;
  setView: (view: View) => void;
  progress: ProgressStats | null;
  refreshProgress: () => Promise<void>;
  currentPair: [Wallpaper, Wallpaper] | null;
  nextPair: [Wallpaper, Wallpaper] | null;
  setPairs: (
    current?: [Wallpaper, Wallpaper] | null,
    next?: [Wallpaper, Wallpaper] | null,
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("scan");
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [currentPair, setCurrentPair] = useState<[Wallpaper, Wallpaper] | null>(
    null,
  );
  const [nextPair, setNextPair] = useState<[Wallpaper, Wallpaper] | null>(null);

  const setPairs = (
    current?: [Wallpaper, Wallpaper] | null,
    next?: [Wallpaper, Wallpaper] | null,
  ) => {
    if (current !== undefined) setCurrentPair(current);
    if (next !== undefined) setNextPair(next);
  };

  const refreshProgress = async () => {
    try {
      const stats = await api.getProgress();
      setProgress(stats);
      // If we have wallpapers, default to rank view if currently on scan
      // This helps persistence across reloads
      if (stats.total_wallpapers > 0 && view === "scan") {
        setView("rank");
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  // Initial load
  useEffect(() => {
    void refreshProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        progress,
        refreshProgress,
        currentPair,
        nextPair,
        setPairs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
