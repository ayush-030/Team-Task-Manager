from datetime import datetime
from typing import Literal

from beanie import PydanticObjectId
from pydantic import BaseModel, ConfigDict, Field


class ProjectMemberOut(BaseModel):
    user_id: PydanticObjectId
    role: Literal["admin", "member"]

    model_config = ConfigDict(from_attributes=True, json_encoders={PydanticObjectId: str})


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = ""


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = None


class ProjectOut(BaseModel):
    id: PydanticObjectId
    name: str
    description: str
    owner_id: PydanticObjectId
    member_ids: list[PydanticObjectId]
    members: list[ProjectMemberOut] = Field(default_factory=list)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, json_encoders={PydanticObjectId: str})


class AddMemberRequest(BaseModel):
    email: str
    role: Literal["admin", "member"] = "member"
