# Project Brief: Local Wallpaper Ranking App

## Overview

A local, offline application to help users curate and rank their desktop wallpaper collection using pairwise comparison. The app runs locally with a Python FastAPI backend and a React frontend.

## Core Goals

1.  **Rank Wallpapers:** Use pairwise comparison (TrueSkill) to rank images.
2.  **Track Confidence:** Measure uncertainty to prioritize comparisons.
3.  **Progress Tracking:** Show evaluation progress.
4.  **User Control:** Allow stopping at any time and reviewing results.
5.  **File Management:** Non-destructive organization (move low-rated files).

## Constraints

- **Offline Only:** No cloud services, runs on localhost.
- **Non-Destructive:** No permanent deletion of files.
- **Tech Stack:** Python (FastAPI, SQLite), React (Vite, shadcn/ui).
- **Environment:** Python virtual environment required.

## Key Features

- **Filesystem Scanning:** Recursively scan for images.
- **Comparison Interface:** Side-by-side voting.
  -Key Features

- **Filesystem Scanning:** Recursively scan for images.
- **Comparison Interface:** Side-by-side voting.
- **Review Mode:** Manage low-rated wallpapers.
