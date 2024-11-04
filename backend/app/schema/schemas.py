from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class AdminUserBase(BaseModel):
    email: EmailStr

class AdminUserCreate(AdminUserBase):
    password: str

class AdminUser(AdminUserBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class AdvertBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    content: str
    photo_url: Optional[str] = None


class AdvertCreate(AdvertBase):
    pass

class AdvertPublish(BaseModel):
    duration: int

class Advert(AdvertBase):
    id: int
    is_published: bool
    publish_start: Optional[datetime]
    publish_end: Optional[datetime]

    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    content: str
    name: str
    email: str
    phone: str
    photo_url: Optional[str] = None

class ReviewCreate(AdvertBase):
    pass

class Review(ReviewBase):
    id: int
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
