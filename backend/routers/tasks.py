from datetime import datetime, timezone

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from dependencies import get_current_user, get_project_or_404, get_task_or_404, is_project_member, require_admin
from models.comment import Comment
from models.task import ChecklistItem, ProgressNote, Task, TaskActivity
from models.user import User
from schemas.task import ChecklistItemCreate, ChecklistItemUpdate, ProgressNoteCreate, ProgressNoteUpdate, TaskCreate, TaskOut, TaskUpdate

router = APIRouter(tags=["tasks"])


async def ensure_assignee_is_member(project_id: PydanticObjectId, assigned_to: PydanticObjectId | None) -> None:
    if assigned_to is None:
        return
    project = await get_project_or_404(project_id)
    if assigned_to != project.owner_id and assigned_to not in project.member_ids:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assigned user must be a project member")


def add_activity(task: Task, user: User, action: str) -> None:
    task.activity.append(TaskActivity(user_id=user.id, user_name=user.username, action=action))


def can_execute_task(task: Task, user: User) -> bool:
    return user.role == "admin" or task.assigned_to is None or task.assigned_to == user.id


def require_task_executor(task: Task, user: User) -> None:
    if not can_execute_task(task, user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the assigned member or an admin can update task execution details")


def validate_blocked_state(task: Task) -> None:
    if task.status == "blocked" and not (task.blocked_reason or "").strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="blocked_reason is required when status is blocked")


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
        blocked_reason=payload.blocked_reason.strip() if payload.blocked_reason else None,
        created_by=current_user.id,
    )
    add_activity(task, current_user, "created this task")
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
        disallowed = set(updates) - {"status", "blocked_reason"}
        if disallowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Members can update status and blocked reason only")
        require_task_executor(task, current_user)
    if "assigned_to" in updates:
        await ensure_assignee_is_member(project.id, updates["assigned_to"])

    previous_status = task.status
    for key, value in updates.items():
        if key == "blocked_reason" and isinstance(value, str):
            value = value.strip() or None
        setattr(task, key, value)
    validate_blocked_state(task)
    if "status" in updates and previous_status != task.status:
        add_activity(task, current_user, f"moved task to {task.status.replace('_', ' ')}")
    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    return task


@router.post("/api/tasks/{task_id}/progress-notes", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def add_progress_note(
    task_id: PydanticObjectId,
    payload: ProgressNoteCreate,
    current_user: User = Depends(get_current_user),
) -> Task:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")
    require_task_executor(task, current_user)
    note = ProgressNote(author_id=current_user.id, author_name=current_user.username, content=payload.content)
    task.progress_notes.append(note)
    add_activity(task, current_user, "added a progress note")
    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    return task


@router.put("/api/tasks/{task_id}/progress-notes/{note_id}", response_model=TaskOut)
async def update_progress_note(
    task_id: PydanticObjectId,
    note_id: str,
    payload: ProgressNoteUpdate,
    current_user: User = Depends(get_current_user),
) -> Task:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")
    note = next((item for item in task.progress_notes if item.id == note_id), None)
    if note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progress note not found")
    if note.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can edit only your own progress notes")
    note.content = payload.content
    note.updated_at = datetime.now(timezone.utc)
    add_activity(task, current_user, "edited a progress note")
    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    return task


@router.delete("/api/tasks/{task_id}/progress-notes/{note_id}", response_model=TaskOut)
async def delete_progress_note(
    task_id: PydanticObjectId,
    note_id: str,
    current_user: User = Depends(get_current_user),
) -> Task:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")
    note = next((item for item in task.progress_notes if item.id == note_id), None)
    if note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progress note not found")
    if note.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can delete only your own progress notes")
    task.progress_notes = [item for item in task.progress_notes if item.id != note_id]
    add_activity(task, current_user, "deleted a progress note")
    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    return task


@router.post("/api/tasks/{task_id}/checklist", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def add_checklist_item(
    task_id: PydanticObjectId,
    payload: ChecklistItemCreate,
    current_user: User = Depends(get_current_user),
) -> Task:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")
    require_task_executor(task, current_user)
    task.checklist.append(ChecklistItem(text=payload.text))
    add_activity(task, current_user, "added a checklist item")
    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    return task


@router.put("/api/tasks/{task_id}/checklist/{item_id}", response_model=TaskOut)
async def update_checklist_item(
    task_id: PydanticObjectId,
    item_id: str,
    payload: ChecklistItemUpdate,
    current_user: User = Depends(get_current_user),
) -> Task:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")
    require_task_executor(task, current_user)
    item = next((entry for entry in task.checklist if entry.id == item_id), None)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(item, key, value)
    add_activity(task, current_user, "updated the checklist")
    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    return task


@router.delete("/api/tasks/{task_id}/checklist/{item_id}", response_model=TaskOut)
async def delete_checklist_item(
    task_id: PydanticObjectId,
    item_id: str,
    current_user: User = Depends(get_current_user),
) -> Task:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")
    require_task_executor(task, current_user)
    if not any(entry.id == item_id for entry in task.checklist):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")
    task.checklist = [entry for entry in task.checklist if entry.id != item_id]
    add_activity(task, current_user, "deleted a checklist item")
    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    return task


@router.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: PydanticObjectId, _: User = Depends(require_admin)) -> None:
    task = await get_task_or_404(task_id)
    await Comment.find(Comment.task_id == task.id).delete()
    await task.delete()
