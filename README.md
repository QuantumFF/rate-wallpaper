# Rate Wallpaper

A local, offline application to help you curate and rank your desktop wallpaper collection using pairwise comparison.

## Overview

Users with large wallpaper collections often struggle to curate them. Traditional rating systems (1-5 stars) are tedious and inconsistent. This application solves the curation problem by using **pairwise comparisons**. By presenting two images and asking "which one do you prefer?", the system builds a reliable ranking using the [TrueSkill](https://trueskill.org/) algorithm without forcing you to invent an absolute score.

## Features

- **Filesystem Scanning:** Recursively scans a local directory for images.
- **Pairwise Comparison:** Simple side-by-side voting interface.
- **TrueSkill Ranking:** Uses a sophisticated rating system to determine the best wallpapers.
- **Review Mode:** View low-rated images in a grid and easily move them to a "rejected" folder (non-destructive).
- **Offline & Private:** Runs entirely on your local machine. No cloud services, no data uploads.
- **Modern UI:** Dark mode interface built with React and shadcn/ui.

## Tech Stack

- **Backend:** Python (FastAPI, SQLite, SQLAlchemy, TrueSkill, Pillow)
- **Frontend:** React (Vite, Tailwind CSS, shadcn/ui)
- **Package Manager:** Bun (Frontend), pip (Backend)

## Prerequisites

- **Python 3.x**
- **Node.js** & **Bun** (or npm/yarn)

## Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd rate-wallpaper
   ```

2. **Backend Setup:**
   Create a virtual environment and install dependencies.

   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

3. **Frontend Setup:**
   Install frontend dependencies.

   ```bash
   bun install
   ```

## Running the Application

1. **Start the Backend:**
   You can use the provided helper script:

   ```bash
   ./run_backend.sh
   ```

   Or run it manually:

   ```bash
   source backend/.venv/bin/activate
   python -m backend.run
   ```

   The backend API will be available at `http://localhost:8000`.

2. **Start the Frontend:**
   Open a new terminal window and run:

   ```bash
   bun run dev
   ```

   The application will be available at `http://localhost:5173`.

## Usage

1. **Scan:** On the home screen, enter the absolute path to your wallpaper folder and click "Start Scanning".
2. **Rank:** Vote on image pairs. Click the image you prefer, or use the Left/Right arrow keys.
3. **Review:** Switch to the "Review" tab to see your lowest-ranked images. Select images to move them to a "rejected" subfolder within their original directory.

## License

This project is licensed under the GNU General Public License v3.0.
