from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.models import models
from app.schema import schemas
from app.db import database
from app.auth import auth
from typing import List, Optional
from datetime import datetime, timedelta
import os
from uuid import uuid4

UPLOAD_DIR = "/mnt/data/uploads"

router = APIRouter()

@router.post("/reviews", response_model=schemas.Review)
async def create_review(
    name: str = File(...),
    email: str = File(...),
    phone: str = File(...),
    content: str = File(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db)
    ):
    file_url = None

    if file:
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        file_url = file_path
    new_review = models.Review(
        name=name,
        email=email,
        phone=phone,
        content=content,
        photo_url=file_url,
        )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

@router.get("/reviews", response_model=List[schemas.Review])
def list_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    reviews = db.query(models.Review).offset(skip).limit(limit).all()
    return reviews

@router.get("/reviews/{review_id}", response_model=schemas.Review)
def get_review(review_id: int, db: Session = Depends(database.get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.post("/reviews/{review_id}/publish", response_model=schemas.Review)
def publish_review(review_id: int, db: Session = Depends(database.get_db), current_user: models.AdminUser = Depends(auth.get_current_user)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_published = True
    db.commit()
    db.refresh(review)
    return review

@router.delete("/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(database.get_db), current_user: models.AdminUser = Depends(auth.get_current_user)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully"}