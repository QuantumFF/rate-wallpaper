from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WallpaperBase(BaseModel):
    filename: str
    path: str
    hash: Optional[str] = None

class Wallpaper(WallpaperBase):
    id: int
    rating_mu: float
    rating_sigma: float
    comparisons_count: int

    class Config:
        from_attributes = True

class ComparisonBase(BaseModel):
    winner_id: int
    loser_id: int

class Comparison(ComparisonBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class Vote(BaseModel):
    winner_id: int
    loser_id: int

class ScanRequest(BaseModel):
    path: str

class MoveRequest(BaseModel):
    wallpaper_id: int
    destination_folder: str
