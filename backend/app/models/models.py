from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from app.db.database import Base
import datetime

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(100))

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(100))

class Advert(Base):
    __tablename__ = "adverts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    name = Column(String(100))
    email = Column(String(100))
    phone = Column(String(20))
    photo_url = Column(String(255), nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    publish_start = Column(DateTime, nullable=True)
    publish_end = Column(DateTime, nullable=True)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    name = Column(String(100))
    email = Column(String(100))
    phone = Column(String(20))
    photo_url = Column(String(255), nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
