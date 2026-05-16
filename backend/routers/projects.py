from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from dependencies import get_current_user, get_project_or_404, is_project_member, is_super_admin, project_member_ids, require_project_admin
from models.comment import Comment
from models.project import Project, ProjectMember
from models.task import Task
from models.user import User
from schemas.project import AddMemberRequest, ProjectCreate, ProjectOut, ProjectUpdate

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=list[ProjectOut])
async def list_projects(current_user: User = Depends(get_current_user)) -> list[Project]:
    if is_super_admin(current_user):
        return await Project.find_all().sort("-created_at").to_list()
    return await Project.find(
        {
            "$or": [
                {"owner_id": current_user.id},
                {"member_ids": current_user.id},
                {"members.user_id": current_user.id},
            ]
        }
    ).sort("-created_at").to_list()


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(payload: ProjectCreate, current_user: User = Depends(get_current_user)) -> Project:
    project = Project(
        name=payload.name,
        description=payload.description,
        owner_id=current_user.id,
        member_ids=[current_user.id],
        members=[ProjectMember(user_id=current_user.id, role="admin")],
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
    require_project_admin(project, current_user)
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(project, key, value)
    await project.save()
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: PydanticObjectId, current_user: User = Depends(get_current_user)) -> None:
    project = await get_project_or_404(project_id)
    require_project_admin(project, current_user)
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
    current_user: User = Depends(get_current_user),
) -> Project:
    project = await get_project_or_404(project_id)
    require_project_admin(project, current_user)
    user = await User.find_one(User.email == payload.email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    role = payload.role if payload.role in {"admin", "member"} else "member"
    if user.id not in project_member_ids(project):
        project.member_ids.append(user.id)
        project.members.append(ProjectMember(user_id=user.id, role=role))
    else:
        for member in project.members:
            if member.user_id == user.id:
                member.role = role
                break
        else:
            project.members.append(ProjectMember(user_id=user.id, role=role))
    await project.save()
    return project


@router.delete("/{project_id}/members/{user_id}", response_model=ProjectOut)
async def remove_member(
    project_id: PydanticObjectId,
    user_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
) -> Project:
    project = await get_project_or_404(project_id)
    require_project_admin(project, current_user)
    if user_id == project.owner_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project owner cannot be removed")
    project.member_ids = [member_id for member_id in project.member_ids if member_id != user_id]
    project.members = [member for member in project.members if member.user_id != user_id]
    await project.save()
    return project
