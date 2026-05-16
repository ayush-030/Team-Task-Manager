from datetime import date, datetime, timezone
from typing import Literal
from uuid import uuid4

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field

TaskStatus = Literal["todo", "in_progress", "review", "blocked", "done"]


class ProgressNote(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    author_id: PydanticObjectId
    author_name: str
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChecklistItem(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    text: str
    completed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TaskActivity(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex)
    user_id: PydanticObjectId
    user_name: str
    action: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Task(Document):
    title: str
    description: str = ""
    project_id: PydanticObjectId
    assigned_to: PydanticObjectId | None = None
    status: TaskStatus = "todo"
    priority: Literal["low", "medium", "high"] = "medium"
    due_date: date | None = None
    blocked_reason: str | None = None
    progress_notes: list[ProgressNote] = Field(default_factory=list)
    checklist: list[ChecklistItem] = Field(default_factory=list)
    activity: list[TaskActivity] = Field(default_factory=list)
    created_by: PydanticObjectId
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "tasks"
