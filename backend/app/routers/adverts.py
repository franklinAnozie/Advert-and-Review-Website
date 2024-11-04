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

@router.post("/adverts", response_model=schemas.Advert)
async def create_advert(
    name: str = File(...),
    email: str = File(...),
    phone: str = File(...),
    content: str = File(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db),
    ):
    file_url = None

    if file:
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        file_url = file_path
    new_advert = models.Advert(
        name=name,
        email=email,
        phone=phone,
        content=content,
        photo_url=file_url,
        )
    db.add(new_advert)
    db.commit()
    db.refresh(new_advert)
    return new_advert

@router.get("/adverts", response_model=List[schemas.Advert])
def list_adverts(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    adverts = db.query(models.Advert).offset(skip).limit(limit).all()
    return adverts

@router.get("/adverts/{advert_id}", response_model=schemas.Advert)
def get_advert(advert_id: int, db: Session = Depends(database.get_db)):
    advert = db.query(models.Advert).filter(models.Advert.id == advert_id).first()
    if advert is None:
        raise HTTPException(status_code=404, detail="Advert not found")
    return advert

@router.post("/adverts/{advert_id}/publish", response_model=schemas.Advert)
def publish_advert(advert_id: int, publish_data: schemas.AdvertPublish, db: Session = Depends(database.get_db), current_user: models.AdminUser = Depends(auth.get_current_user)):
    advert = db.query(models.Advert).filter(models.Advert.id == advert_id).first()
    if advert is None:
        raise HTTPException(status_code=404, detail="Advert not found")
    
    advert.is_published = True
    advert.publish_start = datetime.now()
    advert.publish_end = datetime.now() + timedelta(days=publish_data.duration)
    db.commit()
    db.refresh(advert)
    return advert

@router.post("/adverts/{advert_id}/unpublish", response_model=schemas.Advert)
def unpublish_advert(
    advert_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.AdminUser = Depends(auth.get_current_user)
):
    advert = db.query(models.Advert).filter(models.Advert.id == advert_id).first()
    if advert is None:
        raise HTTPException(status_code=404, detail="Advert not found")
    
    if not advert.is_published:
        raise HTTPException(status_code=400, detail="Advert is not currently published")

    # Unpublish the advert
    advert.is_published = False
    advert.publish_end = None
    db.commit()
    db.refresh(advert)
    return advert

@router.delete("/adverts/{advert_id}")
def delete_advert(advert_id: int, db: Session = Depends(database.get_db), current_user: models.AdminUser = Depends(auth.get_current_user)):
    advert = db.query(models.Advert).filter(models.Advert.id == advert_id).first()
    if advert is None:
        raise HTTPException(status_code=404, detail="Advert not found")
    if advert.photo_url and os.path.exists(advert.photo_url):
        os.remove(advert.photo_url)
    db.delete(advert)
    db.commit()
    return {"message": "Advert deleted successfully"}

@router.put("/adverts/{advert_id}", response_model=schemas.Advert)
async def update_advert(
    advert_id: int,
    name: Optional[str] = File(None),
    email: Optional[str] = File(None),
    phone: Optional[str] = File(None),
    content: Optional[str] = File(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db),
    current_user: models.AdminUser = Depends(auth.get_current_user)
):
    advert = db.query(models.Advert).filter(models.Advert.id == advert_id).first()
    if advert is None:
        raise HTTPException(status_code=404, detail="Advert not found")

    if name:
        advert.name = name
    if email:
        advert.email = email
    if phone:
        advert.phone = phone
    if content:
        advert.content = content

    if file:
        if advert.photo_url and os.path.exists(advert.photo_url):
            os.remove(advert.photo_url)
        
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        advert.photo_url = file_path

    db.commit()
    db.refresh(advert)
    return advert
