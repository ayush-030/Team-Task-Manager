from datetime import datetime, timezone
from typing import Literal

from beanie import Document
from pydantic import EmailStr, Field
from pymongo import ASCENDING, IndexModel


class User(Document):
    email: EmailStr
    username: str
    hashed_password: str
    role: Literal["admin", "member"] = "member"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        indexes = [
            IndexModel([("email", ASCENDING)], unique=True),
            IndexModel([("username", ASCENDING)], unique=True),
        ]
