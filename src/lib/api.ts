export interface Wallpaper {
  id: number;
  filename: string;
  path: string;
  rating_mu: number;
  rating_sigma: number;
  comparisons_count: number;
}

export interface ProgressStats {
  total_wallpapers: number;
  total_comparisons: number;
  evaluated_count: number;
  participated_count: number;
  percentage: number;
}

const API_BASE = "http://localhost:8000";

export const api = {
  getImageUrl: (id: number, size: "small" | "medium" | "full" = "full") =>
    `${API_BASE}/images/${id}?size=${size}`,

  scanDirectory: async (path: string): Promise<number> => {
    const res = await fetch(`${API_BASE}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    if (!res.ok) throw new Error("Failed to scan directory");
    return res.json();
  },

  getPair: async (): Promise<[Wallpaper, Wallpaper]> => {
    const res = await fetch(`${API_BASE}/pair`);
    if (!res.ok) throw new Error("Failed to get pair");
    return res.json();
  },

  vote: async (winnerId: number, loserId: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner_id: winnerId, loser_id: loserId }),
    });
    if (!res.ok) throw new Error("Failed to submit vote");
  },

  getProgress: async (): Promise<ProgressStats> => {
    const res = await fetch(`${API_BASE}/progress`);
    if (!res.ok) throw new Error("Failed to get progress");
    return res.json();
  },

  getReviewList: async (limit: number = 50): Promise<Wallpaper[]> => {
    const res = await fetch(`${API_BASE}/review?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to get review list");
    return res.json();
  },

  moveWallpaper: async (
    wallpaperId: number,
    destinationFolder: string,
  ): Promise<void> => {
    const res = await fetch(`${API_BASE}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallpaper_id: wallpaperId,
        destination_folder: destinationFolder,
      }),
    });
    if (!res.ok) throw new Error("Failed to move wallpaper");
  },
};
