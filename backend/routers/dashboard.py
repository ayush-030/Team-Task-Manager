from datetime import date

from fastapi import APIRouter, Depends

from dependencies import get_current_user
from models.project import Project
from models.task import Task
from models.user import User
from schemas.dashboard import DashboardOut

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardOut)
async def dashboard(current_user: User = Depends(get_current_user)) -> DashboardOut:
    if current_user.role == "admin":
        projects = await Project.find_all().to_list()
    else:
        projects = await Project.find(
            {"$or": [{"owner_id": current_user.id}, {"member_ids": current_user.id}]}
        ).to_list()
    project_ids = [project.id for project in projects]
    by_status = {"todo": 0, "in_progress": 0, "done": 0}
    if not project_ids:
        return DashboardOut(total_tasks=0, completed_pct=0, overdue_count=0, by_status=by_status)

    tasks = await Task.find({"project_id": {"$in": project_ids}}).to_list()
    overdue_count = 0
    for task in tasks:
        by_status[task.status] += 1
        if task.due_date is not None and task.due_date < date.today() and task.status != "done":
            overdue_count += 1
    total = len(tasks)
    completed_pct = round((by_status["done"] / total) * 100, 1) if total else 0
    return DashboardOut(
        total_tasks=total,
        completed_pct=completed_pct,
        overdue_count=overdue_count,
        by_status=by_status,
    )
