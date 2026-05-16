from pydantic import BaseModel, Field


class CompletedTasksPoint(BaseModel):
    label: str
    date: str
    completed: int


class ProductivityPoint(BaseModel):
    label: str
    date: str
    assigned_tasks: int
    completed_tasks: int
    productivity: float


class ProjectProgressPoint(BaseModel):
    project_id: str
    name: str
    tasks: int
    completed_tasks: int
    progress: float


class DashboardOut(BaseModel):
    total_tasks: int
    completed_pct: float
    overdue_count: int
    by_status: dict[str, int]
    blocked_count: int = 0
    review_count: int = 0
    checklist_completion_pct: float = 0
    completed_over_time: list[CompletedTasksPoint] = Field(default_factory=list)
    weekly_productivity: list[ProductivityPoint] = Field(default_factory=list)
    project_progress: list[ProjectProgressPoint] = Field(default_factory=list)
