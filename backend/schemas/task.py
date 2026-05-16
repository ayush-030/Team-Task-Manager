from datetime import date, datetime
from typing import Literal

from beanie import PydanticObjectId
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

TaskStatus = Literal["todo", "in_progress", "review", "blocked", "done"]


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    description: str = ""
    assigned_to: PydanticObjectId | None = None
    status: TaskStatus = "todo"
    priority: Literal["low", "medium", "high"] = "medium"
    due_date: date | None = None
    blocked_reason: str | None = None

    @field_validator("due_date")
    @classmethod
    def due_date_not_past(cls, value: date | None) -> date | None:
        if value is not None and value < date.today():
            raise ValueError("due_date must not be in the past")
        return value

    @model_validator(mode="after")
    def blocked_tasks_need_reason(self) -> "TaskCreate":
        if self.status == "blocked" and not (self.blocked_reason or "").strip():
            raise ValueError("blocked_reason is required when status is blocked")
        return self


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=160)
    description: str | None = None
    assigned_to: PydanticObjectId | None = None
    status: TaskStatus | None = None
    priority: Literal["low", "medium", "high"] | None = None
    due_date: date | None = None
    blocked_reason: str | None = None

    @field_validator("due_date")
    @classmethod
    def due_date_not_past(cls, value: date | None) -> date | None:
        if value is not None and value < date.today():
            raise ValueError("due_date must not be in the past")
        return value


class ProgressNoteCreate(BaseModel):
    content: str = Field(min_length=1, max_length=1000)

    @field_validator("content")
    @classmethod
    def content_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Progress note must not be empty")
        return stripped


class ProgressNoteUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=1000)

    @field_validator("content")
    @classmethod
    def content_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Progress note must not be empty")
        return stripped


class ChecklistItemCreate(BaseModel):
    text: str = Field(min_length=1, max_length=240)

    @field_validator("text")
    @classmethod
    def text_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Checklist item must not be empty")
        return stripped


class ChecklistItemUpdate(BaseModel):
    text: str | None = Field(default=None, min_length=1, max_length=240)
    completed: bool | None = None

    @field_validator("text")
    @classmethod
    def text_not_blank(cls, value: str | None) -> str | None:
        if value is None:
            return value
        stripped = value.strip()
        if not stripped:
            raise ValueError("Checklist item must not be empty")
        return stripped


class ProgressNoteOut(BaseModel):
    id: str
    author_id: PydanticObjectId
    author_name: str
    content: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, json_encoders={PydanticObjectId: str})


class ChecklistItemOut(BaseModel):
    id: str
    text: str
    completed: bool
    created_at: datetime


class TaskActivityOut(BaseModel):
    id: str
    user_id: PydanticObjectId
    user_name: str
    action: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, json_encoders={PydanticObjectId: str})


class TaskOut(BaseModel):
    id: PydanticObjectId
    title: str
    description: str
    project_id: PydanticObjectId
    assigned_to: PydanticObjectId | None
    status: TaskStatus
    priority: Literal["low", "medium", "high"]
    due_date: date | None
    blocked_reason: str | None = None
    progress_notes: list[ProgressNoteOut] = Field(default_factory=list)
    checklist: list[ChecklistItemOut] = Field(default_factory=list)
    activity: list[TaskActivityOut] = Field(default_factory=list)
    created_by: PydanticObjectId
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, json_encoders={PydanticObjectId: str})
