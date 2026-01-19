# Active Context

## Current Focus

Project completion and verification.

## Recent Changes

- **Backend Logic:**
  - Updated `/move` endpoint to handle relative paths. If a relative path (e.g., "rejected") is provided, the file is moved to a subfolder within its _current_ directory, rather than relative to the application root.
- **UI Refinement (User Feedback):**
  - **RankView:**
    - Grouped progress bar and wallpaper cards in a centered container to bring them closer together.
    - Added `rounded-xl` to the selection outline for visual consistency.
    - Enforced 16:9 aspect ratio for wallpaper containers (`aspect-video`).
    - Used `object-cover` to ensure wallpapers fill the entire frame.
  - **Layout:**
    - Removed the persistent "Wallpaper Ranker" header for a fully immersive experience.
    - Removed top padding to maximize screen real estate.
- **UI Redesign (Modern & Minimalist):**
  - **Global:** Enforced Dark Mode (Zinc palette) via `index.css`.
  - **Layout:** Minimalist full-screen layout.
  - **ScanView:** Redesigned with a clean, centered input.
  - **ReviewView:** Clean grid layout.

## Next Steps

- **User Verification:** User to test the final UI adjustments and the new move behavior.

## Active Decisions

- **File Operations:** Moving files with a relative path now implies "create subfolder in source directory", which is safer and more intuitive for organizing collections in place.
- **Immersive Mode:** Removed the app header entirely to focus 100% on the content (wallpapers).
- **Aspect Ratio:** Enforced 16:9 for consistency, even if it means cropping non-standard wallpapers (via `object-cover`).
- **Dark Mode:** Enforced as default.
