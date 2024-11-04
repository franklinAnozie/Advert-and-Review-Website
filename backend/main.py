from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import RedirectResponse
from app.db.database import engine
from app.models import models
from app.routers import admin, adverts, reviews, users
import os

class TrailingSlashMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.url.path.endswith('/') and request.url.path != '/':
            url = str(request.url).rstrip('/')
            return RedirectResponse(url, status_code=301)
        response = await call_next(request)
        return response

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(TrailingSlashMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://advertorial-hub-frontend.vercel.app/",
        "https://advertorial-hub-frontend.vercel.app",
        "https://www.advertorial-hub-frontend.vercel.app/",
        "https://www.advertorial-hub-frontend.vercel.app",
        ],
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
        ],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount(UPLOAD_DIR, StaticFiles(directory="./uploads"), name="uploads")

app.include_router(admin.router)
app.include_router(users.router)
app.include_router(adverts.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the Advert and Review API"}
