from datetime import datetime, timezone
from typing import Literal

from beanie import Document
from pydantic import EmailStr, Field, field_validator
from pymongo import ASCENDING, IndexModel


class User(Document):
    email: EmailStr
    username: str
    hashed_password: str
    role: Literal["super_admin", "user"] = "user"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("role", mode="before")
    @classmethod
    def migrate_legacy_roles(cls, value: str) -> str:
        if value == "admin":
            return "super_admin"
        if value == "member":
            return "user"
        return value

    class Settings:
        name = "users"
        indexes = [
            IndexModel([("email", ASCENDING)], unique=True),
            IndexModel([("username", ASCENDING)], unique=True),
        ]
