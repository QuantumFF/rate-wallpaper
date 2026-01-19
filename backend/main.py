import os
import shutil
import random
from typing import List
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas, database, scanner, ranking

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mount images directory dynamically? 
# We need to know the root directory. For now, we can serve specific files via an endpoint 
# or we can ask the user to mount a specific path. 
# Better approach: The frontend requests an image by ID, and the backend streams it.
# Or, since we are local, we can just serve the root folder if we knew it.
# Let's add an endpoint to serve image by ID.

from fastapi.responses import FileResponse

@app.get("/images/{wallpaper_id}")
def get_image(wallpaper_id: int, db: Session = Depends(get_db)):
    wallpaper = db.query(models.Wallpaper).filter(models.Wallpaper.id == wallpaper_id).first()
    if not wallpaper:
        raise HTTPException(status_code=404, detail="Wallpaper not found")
    return FileResponse(wallpaper.path)

@app.post("/scan", response_model=int)
def scan_files(request: schemas.ScanRequest, db: Session = Depends(get_db)):
    if not os.path.isdir(request.path):
        raise HTTPException(status_code=400, detail="Invalid directory path")
    
    count = scanner.scan_directory(request.path, db)
    return count

@app.get("/pair", response_model=List[schemas.Wallpaper])
def get_pair(db: Session = Depends(get_db)):
    # Strategy: Prioritize wallpapers with fewer comparisons
    # 1. Get a random wallpaper from the pool of "least compared"
    # 2. Get a second wallpaper that is close in rating (or random if not enough data)
    
    # Simple version: Pick two random wallpapers
    # Better version: Pick one with low comparisons, one random
    
    count = db.query(models.Wallpaper).count()
    if count < 2:
        raise HTTPException(status_code=400, detail="Not enough wallpapers")

    # Try to find wallpapers with 0 comparisons first
    zero_comps = db.query(models.Wallpaper).filter(models.Wallpaper.comparisons_count == 0).limit(100).all()
    
    if zero_comps:
        w1 = random.choice(zero_comps)
    else:
        # Pick a random one
        offset = random.randint(0, count - 1)
        w1 = db.query(models.Wallpaper).offset(offset).first()
    
    # Pick w2 (ensure it's not w1)
    # For now, just pick random. 
    # Future improvement: Pick one with similar rating to maximize info gain.
    while True:
        offset = random.randint(0, count - 1)
        w2 = db.query(models.Wallpaper).offset(offset).first()
        if w2.id != w1.id:
            break
            
    return [w1, w2]

@app.post("/vote")
def vote(vote: schemas.Vote, db: Session = Depends(get_db)):
    winner = db.query(models.Wallpaper).filter(models.Wallpaper.id == vote.winner_id).first()
    loser = db.query(models.Wallpaper).filter(models.Wallpaper.id == vote.loser_id).first()
    
    if not winner or not loser:
        raise HTTPException(status_code=404, detail="Wallpaper not found")
    
    # Update ratings
    ranking.update_ratings(winner, loser)
    
    winner.comparisons_count += 1
    loser.comparisons_count += 1
    
    # Record comparison
    comp = models.Comparison(winner_id=winner.id, loser_id=loser.id)
    db.add(comp)
    db.commit()
    
    return {"status": "success"}

@app.get("/progress")
def get_progress(db: Session = Depends(get_db)):
    total_wallpapers = db.query(models.Wallpaper).count()
    total_comparisons = db.query(models.Comparison).count()
    
    # Calculate "evaluated" percentage (e.g., sigma < threshold)
    # Threshold: default sigma is 8.333. Let's say < 4.0 is "evaluated"
    evaluated_count = db.query(models.Wallpaper).filter(models.Wallpaper.rating_sigma < 4.0).count()
    
    percentage = 0
    if total_wallpapers > 0:
        percentage = (evaluated_count / total_wallpapers) * 100
        
    return {
        "total_wallpapers": total_wallpapers,
        "total_comparisons": total_comparisons,
        "evaluated_count": evaluated_count,
        "percentage": percentage
    }

@app.get("/review", response_model=List[schemas.Wallpaper])
def review_wallpapers(limit: int = 50, db: Session = Depends(get_db)):
    # Sort by conservative lower bound (mu - 3*sigma)
    # Since we can't easily do math in SQL with SQLite for this without custom functions,
    # we might fetch all and sort in python if dataset is small, OR
    # just sort by mu for now.
    # Let's fetch all (assuming < 10k isn't too slow) or use a simplified sort.
    # Actually, sorting by mu is a decent approximation if sigmas are similar.
    
    # Let's try to do it in Python for correctness, assuming < 10000 items.
    # If > 10000, we might need a better strategy.
    
    wallpapers = db.query(models.Wallpaper).all()
    # Sort by mu - 3*sigma (ascending)
    wallpapers.sort(key=lambda w: w.rating_mu - 3 * w.rating_sigma)
    
    return wallpapers[:limit]

@app.post("/move")
def move_wallpaper(request: schemas.MoveRequest, db: Session = Depends(get_db)):
    wallpaper = db.query(models.Wallpaper).filter(models.Wallpaper.id == request.wallpaper_id).first()
    if not wallpaper:
        raise HTTPException(status_code=404, detail="Wallpaper not found")
    
    # Determine destination directory
    # If absolute, use as is. If relative, make it relative to the wallpaper's location.
    if os.path.isabs(request.destination_folder):
        dest_dir = request.destination_folder
    else:
        dest_dir = os.path.join(os.path.dirname(wallpaper.path), request.destination_folder)

    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    filename = os.path.basename(wallpaper.path)
    dest_path = os.path.join(dest_dir, filename)
    
    try:
        shutil.move(wallpaper.path, dest_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Update DB path or remove?
    # Requirement says "move to subfolder". 
    # We should probably update the path in DB to reflect new location, 
    # OR remove it from the ranking pool?
    # "Review and safely move low-rated wallpapers to a subfolder" implies getting rid of them.
    # So let's delete from DB.
    
    db.delete(wallpaper)
    db.commit()
    
    return {"status": "moved"}
