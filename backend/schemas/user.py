from datetime import datetime
from typing import Literal

from beanie import PydanticObjectId
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=40)
    password: str = Field(min_length=8)


class UserOut(BaseModel):
    id: PydanticObjectId
    email: EmailStr
    username: str
    role: Literal["super_admin", "user"]
    created_at: datetime

    @field_validator("role", mode="before")
    @classmethod
    def migrate_legacy_roles(cls, value: str) -> str:
        if value == "admin":
            return "super_admin"
        if value == "member":
            return "user"
        return value

    model_config = ConfigDict(from_attributes=True, json_encoders={PydanticObjectId: str})


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class RefreshRequest(BaseModel):
    refresh_token: str


class AccessToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    sub: str
    token_type: Literal["access", "refresh"]
