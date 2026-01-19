import os
from sqlalchemy.orm import Session
from . import models

SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}

def scan_directory(directory: str, db: Session):
    added_count = 0
    for root, _, files in os.walk(directory):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in SUPPORTED_EXTENSIONS:
                full_path = os.path.abspath(os.path.join(root, file))
                
                # Check if exists
                exists = db.query(models.Wallpaper).filter(models.Wallpaper.path == full_path).first()
                if not exists:
                    wallpaper = models.Wallpaper(
                        filename=file,
                        path=full_path
                    )
                    db.add(wallpaper)
                    added_count += 1
    
    db.commit()
    return added_count
