from datetime import date, datetime, time, timedelta, timezone

from fastapi import APIRouter, Depends

from dependencies import get_current_user
from models.project import Project
from models.task import Task
from models.user import User
from schemas.dashboard import DashboardOut

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


def day_start(value: date) -> datetime:
    return datetime.combine(value, time.min, tzinfo=timezone.utc)


def day_end(value: date) -> datetime:
    return datetime.combine(value, time.max, tzinfo=timezone.utc)


def date_key(value: date) -> str:
    return value.isoformat()


def day_label(value: date) -> str:
    return value.strftime("%a")


def as_aware(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


@router.get("", response_model=DashboardOut)
async def dashboard(current_user: User = Depends(get_current_user)) -> DashboardOut:
    if current_user.role == "admin":
        projects = await Project.find_all().to_list()
    else:
        projects = await Project.find(
            {"$or": [{"owner_id": current_user.id}, {"member_ids": current_user.id}]}
        ).to_list()
    project_ids = [project.id for project in projects]
    by_status = {"todo": 0, "in_progress": 0, "review": 0, "blocked": 0, "done": 0}
    if not project_ids:
        today = date.today()
        empty_week = [
            {
                "label": day_label(today - timedelta(days=6 - index)),
                "date": date_key(today - timedelta(days=6 - index)),
                "completed": 0,
            }
            for index in range(7)
        ]
        empty_productivity = [
            {
                "label": point["label"],
                "date": point["date"],
                "assigned_tasks": 0,
                "completed_tasks": 0,
                "productivity": 0,
            }
            for point in empty_week
        ]
        return DashboardOut(
            total_tasks=0,
            completed_pct=0,
            overdue_count=0,
            by_status=by_status,
            completed_over_time=empty_week,
            weekly_productivity=empty_productivity,
            project_progress=[],
        )

    tasks = await Task.find({"project_id": {"$in": project_ids}}).to_list()
    overdue_count = 0
    checklist_total = 0
    checklist_done = 0
    for task in tasks:
        by_status[task.status] = by_status.get(task.status, 0) + 1
        if task.due_date is not None and task.due_date < date.today() and task.status != "done":
            overdue_count += 1
        checklist_total += len(task.checklist)
        checklist_done += len([item for item in task.checklist if item.completed])
    total = len(tasks)
    completed_pct = round((by_status["done"] / total) * 100, 1) if total else 0
    checklist_completion_pct = round((checklist_done / checklist_total) * 100, 1) if checklist_total else 0

    today = date.today()
    window_days = [today - timedelta(days=6 - index) for index in range(7)]
    window_start = day_start(window_days[0])
    collection = Task.get_motor_collection()

    completed_pipeline = [
        {
            "$match": {
                "project_id": {"$in": project_ids},
                "status": "done",
                "updated_at": {"$gte": window_start},
            }
        },
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$updated_at"}},
                "completed": {"$sum": 1},
            }
        },
    ]
    completed_rows = await collection.aggregate(completed_pipeline).to_list(length=None)
    completed_by_date = {row["_id"]: row["completed"] for row in completed_rows}
    completed_over_time = [
        {
            "label": day_label(day),
            "date": date_key(day),
            "completed": completed_by_date.get(date_key(day), 0),
        }
        for day in window_days
    ]

    weekly_productivity = []
    for day in window_days:
        end = day_end(day)
        assigned_tasks = [
            task for task in tasks
            if task.assigned_to is not None and as_aware(task.created_at) <= end
        ]
        completed_tasks = [
            task for task in assigned_tasks
            if task.status == "done" and as_aware(task.updated_at) <= end
        ]
        productivity = round((len(completed_tasks) / len(assigned_tasks)) * 100, 1) if assigned_tasks else 0
        weekly_productivity.append(
            {
                "label": day_label(day),
                "date": date_key(day),
                "assigned_tasks": len(assigned_tasks),
                "completed_tasks": len(completed_tasks),
                "productivity": productivity,
            }
        )

    project_progress = []
    for project in projects:
        project_tasks = [task for task in tasks if task.project_id == project.id]
        project_completed = len([task for task in project_tasks if task.status == "done"])
        project_progress.append(
            {
                "project_id": str(project.id),
                "name": project.name,
                "tasks": len(project_tasks),
                "completed_tasks": project_completed,
                "progress": round((project_completed / len(project_tasks)) * 100, 1) if project_tasks else 0,
            }
        )

    return DashboardOut(
        total_tasks=total,
        completed_pct=completed_pct,
        overdue_count=overdue_count,
        by_status=by_status,
        blocked_count=by_status["blocked"],
        review_count=by_status["review"],
        checklist_completion_pct=checklist_completion_pct,
        completed_over_time=completed_over_time,
        weekly_productivity=weekly_productivity,
        project_progress=project_progress,
    )
