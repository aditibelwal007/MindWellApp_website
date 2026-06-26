from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

# ----------------------------
# Environment Setup
# ----------------------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ----------------------------
# MongoDB Connection
# ----------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ----------------------------
# FastAPI App
# ----------------------------
app = FastAPI()

# Router with /api prefix
api_router = APIRouter(prefix="/api")

# ----------------------------
# Models
# ----------------------------

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class StatusCheckCreate(BaseModel):
    client_name: str


class MoodRequest(BaseModel):
    text: str


class MoodResponse(BaseModel):
    mood: str
    recommended_game: str


class GameCompletion(BaseModel):
    game_name: str
    mood_before: str
    mood_after: str
    score: int


# ----------------------------
# Basic Routes
# ----------------------------

@api_router.get("/")
async def root():
    return {
        "message": "MindWell API Running Successfully"
    }


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()

    status_obj = StatusCheck(**status_dict)

    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()

    await db.status_checks.insert_one(doc)

    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():

    status_checks = await db.status_checks.find(
        {},
        {"_id": 0}
    ).to_list(1000)

    for check in status_checks:
        if isinstance(check["timestamp"], str):
            check["timestamp"] = datetime.fromisoformat(
                check["timestamp"]
            )

    return status_checks


# ----------------------------
# Mood Analyzer Route
# ----------------------------

@api_router.post("/analyze-mood", response_model=MoodResponse)
async def analyze_mood(data: MoodRequest):

    text = data.text.lower()

    if any(word in text for word in [
        "stress",
        "stressed",
        "pressure",
        "exam",
        "overwhelmed"
    ]):
        mood = "Stress"

    elif any(word in text for word in [
        "anxiety",
        "anxious",
        "worried",
        "nervous"
    ]):
        mood = "Anxiety"

    elif any(word in text for word in [
        "sad",
        "depressed",
        "unhappy",
        "lonely"
    ]):
        mood = "Sad"

    elif any(word in text for word in [
        "angry",
        "frustrated",
        "mad"
    ]):
        mood = "Angry"

    else:
        mood = "Happy"

    game_map = {
        "Stress": "Breathing Game",
        "Anxiety": "Color Therapy",
        "Sad": "Gratitude Game",
        "Angry": "Focus Challenge",
        "Happy": "Memory Match"
    }

    recommended_game = game_map[mood]

    await db.moods.insert_one({
        "text": data.text,
        "mood": mood,
        "recommended_game": recommended_game,
        "created_at": datetime.now(
            timezone.utc
        ).isoformat()
    })

    return MoodResponse(
        mood=mood,
        recommended_game=recommended_game
    )


# ----------------------------
# Game Completion Route
# ----------------------------

@api_router.post("/game-complete")
async def game_complete(data: GameCompletion):

    await db.game_sessions.insert_one({
        "game_name": data.game_name,
        "mood_before": data.mood_before,
        "mood_after": data.mood_after,
        "score": data.score,
        "completed_at": datetime.now(
            timezone.utc
        ).isoformat()
    })

    return {
        "message": "Game session saved successfully"
    }


# ----------------------------
# Get Mood History
# ----------------------------

@api_router.get("/mood-history")
async def mood_history():

    moods = await db.moods.find(
        {},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)

    return moods


# ----------------------------
# Get Game Sessions
# ----------------------------

@api_router.get("/game-history")
async def game_history():

    sessions = await db.game_sessions.find(
        {},
        {"_id": 0}
    ).sort("completed_at", -1).to_list(100)

    return sessions


# ----------------------------
# Register Router
# ----------------------------

app.include_router(api_router)

# ----------------------------
# CORS
# ----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get(
        "CORS_ORIGINS",
        "*"
    ).split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Logging
# ----------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


# ----------------------------
# Shutdown Event
# ----------------------------

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()