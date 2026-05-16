from pydantic import BaseModel


class DashboardOut(BaseModel):
    total_tasks: int
    completed_pct: float
    overdue_count: int
    by_status: dict[str, int]
    blocked_count: int = 0
    review_count: int = 0
    checklist_completion_pct: float = 0
