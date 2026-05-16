from datetime import datetime, timezone
from typing import Literal

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field


class ProjectMember(BaseModel):
    user_id: PydanticObjectId
    role: Literal["admin", "member"] = "member"


class Project(Document):
    name: str
    description: str = ""
    owner_id: PydanticObjectId
    member_ids: list[PydanticObjectId] = Field(default_factory=list)
    members: list[ProjectMember] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "projects"
