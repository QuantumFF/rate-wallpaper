from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Wallpaper(Base):
    __tablename__ = "wallpapers"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    path = Column(String, unique=True, index=True)
    hash = Column(String, nullable=True)
    
    # TrueSkill ratings
    rating_mu = Column(Float, default=25.0)
    rating_sigma = Column(Float, default=8.333)
    
    comparisons_count = Column(Integer, default=0)

class Comparison(Base):
    __tablename__ = "comparisons"

    id = Column(Integer, primary_key=True, index=True)
    winner_id = Column(Integer, ForeignKey("wallpapers.id"))
    loser_id = Column(Integer, ForeignKey("wallpapers.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)

    winner = relationship("Wallpaper", foreign_keys=[winner_id])
    loser = relationship("Wallpaper", foreign_keys=[loser_id])
