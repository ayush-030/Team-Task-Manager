from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from dependencies import get_current_user, get_project_or_404, is_project_member, is_project_owner_or_admin, require_admin
from models.comment import Comment
from models.project import Project
from models.task import Task
from models.user import User
from schemas.project import AddMemberRequest, ProjectCreate, ProjectOut, ProjectUpdate

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=list[ProjectOut])
async def list_projects(current_user: User = Depends(get_current_user)) -> list[Project]:
    if current_user.role == "admin":
        return await Project.find_all().sort("-created_at").to_list()
    return await Project.find(
        {"$or": [{"owner_id": current_user.id}, {"member_ids": current_user.id}]}
    ).sort("-created_at").to_list()


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(payload: ProjectCreate, current_user: User = Depends(require_admin)) -> Project:
    project = Project(
        name=payload.name,
        description=payload.description,
        owner_id=current_user.id,
        member_ids=[current_user.id],
    )
    await project.insert()
    return project


@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(project_id: PydanticObjectId, current_user: User = Depends(get_current_user)) -> Project:
    project = await get_project_or_404(project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Project access denied")
    return project


@router.put("/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: PydanticObjectId,
    payload: ProjectUpdate,
    current_user: User = Depends(get_current_user),
) -> Project:
    project = await get_project_or_404(project_id)
    if not is_project_owner_or_admin(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Project update denied")
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(project, key, value)
    await project.save()
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: PydanticObjectId, current_user: User = Depends(get_current_user)) -> None:
    project = await get_project_or_404(project_id)
    if not is_project_owner_or_admin(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Project deletion denied")
    tasks = await Task.find(Task.project_id == project.id).to_list()
    task_ids = [task.id for task in tasks]
    if task_ids:
        await Comment.find({"task_id": {"$in": task_ids}}).delete()
        await Task.find({"_id": {"$in": task_ids}}).delete()
    await project.delete()


@router.post("/{project_id}/members", response_model=ProjectOut)
async def add_member(
    project_id: PydanticObjectId,
    payload: AddMemberRequest,
    _: User = Depends(require_admin),
) -> Project:
    project = await get_project_or_404(project_id)
    user = await User.find_one(User.email == payload.email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.id not in project.member_ids:
        project.member_ids.append(user.id)
        await project.save()
    return project
