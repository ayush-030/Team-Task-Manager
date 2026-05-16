from datetime import datetime, timezone

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from dependencies import get_current_user, get_project_or_404, get_task_or_404, is_project_member, require_admin
from models.comment import Comment
from models.task import Task
from models.user import User
from schemas.task import TaskCreate, TaskOut, TaskUpdate

router = APIRouter(tags=["tasks"])


async def ensure_assignee_is_member(project_id: PydanticObjectId, assigned_to: PydanticObjectId | None) -> None:
    if assigned_to is None:
        return
    project = await get_project_or_404(project_id)
    if assigned_to != project.owner_id and assigned_to not in project.member_ids:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assigned user must be a project member")


@router.get("/api/projects/{project_id}/tasks", response_model=list[TaskOut])
async def list_tasks(project_id: PydanticObjectId, current_user: User = Depends(get_current_user)) -> list[Task]:
    project = await get_project_or_404(project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Project access denied")
    return await Task.find(Task.project_id == project.id).sort("-created_at").to_list()


@router.post("/api/projects/{project_id}/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def create_task(
    project_id: PydanticObjectId,
    payload: TaskCreate,
    current_user: User = Depends(require_admin),
) -> Task:
    project = await get_project_or_404(project_id)
    await ensure_assignee_is_member(project.id, payload.assigned_to)
    task = Task(
        title=payload.title,
        description=payload.description,
        project_id=project.id,
        assigned_to=payload.assigned_to,
        status=payload.status,
        priority=payload.priority,
        due_date=payload.due_date,
        created_by=current_user.id,
    )
    await task.insert()
    return task


@router.get("/api/tasks/{task_id}", response_model=TaskOut)
async def get_task(task_id: PydanticObjectId, current_user: User = Depends(get_current_user)) -> Task:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")
    return task


@router.put("/api/tasks/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: PydanticObjectId,
    payload: TaskUpdate,
    current_user: User = Depends(get_current_user),
) -> Task:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")

    updates = payload.model_dump(exclude_unset=True)
    if current_user.role != "admin":
        disallowed = set(updates) - {"status"}
        if disallowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Members can update status only")
    if "assigned_to" in updates:
        await ensure_assignee_is_member(project.id, updates["assigned_to"])

    for key, value in updates.items():
        setattr(task, key, value)
    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    return task


@router.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: PydanticObjectId, _: User = Depends(require_admin)) -> None:
    task = await get_task_or_404(task_id)
    await Comment.find(Comment.task_id == task.id).delete()
    await task.delete()
