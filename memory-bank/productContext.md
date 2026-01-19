# Product Context

## Problem Statement

Users with large wallpaper collections often struggle to curate them. Traditional rating systems (1-5 stars) are tedious and inconsistent. It's hard to decide if one image is a "4" or a "5", but it's easy to say "I prefer Image A over Image B".

## Solution

This application solves the curation problem by using **pairwise comparisons**. By presenting two images and asking "which one do you prefer?", the system can build a reliable ranking without forcing the user to invent an absolute score.

## User Experience

1. **Setup:** User points the app to a wallpaper folder via a clean, modern input screen.
2. **Ranking:** User is presented with a split-screen view of two images. The interface is minimalist and dark, allowing the images to take center stage.
   - **Voting:** Click an image or use arrow keys (Left/Right).
   - **Feedback:** Subtle visual cues confirm the vote.
3. **Progress:** A discreet progress bar shows evaluation status.
4. **Review:** User decides to stop and review the bottom-ranked images in a clean grid layout.
5. **Action:** User moves unwanted wallpapers to a "rejected" folder using simple, non-destructive actions.

## Success Metrics

- **Ease of Use:** Fast voting with keyboard shortcuts and immediate visual feedback.
- **Ranking Quality:** The resulting ranking feels "correct" to the user.
- **Safety:** No accidental data loss (files are moved, not deleted).
- **Aesthetics:** The app feels modern, professional, and unobtrusive (Dark Mode).
