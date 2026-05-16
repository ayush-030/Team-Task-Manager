from beanie import PydanticObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from config import get_settings
from models.project import Project
from models.task import Task
from models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    settings = get_settings()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id = payload.get("sub")
        token_type = payload.get("type")
        if user_id is None or token_type != "access":
            raise credentials_exception
    except JWTError as exc:
        raise credentials_exception from exc

    user = await User.get(PydanticObjectId(user_id))
    if user is None:
        raise credentials_exception
    return user


async def require_super_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Super admin access required")
    return current_user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    return await require_super_admin(current_user)


def is_super_admin(user: User) -> bool:
    return user.role == "super_admin"


def project_member_ids(project: Project) -> set[PydanticObjectId]:
    ids = set(project.member_ids or [])
    ids.add(project.owner_id)
    for member in project.members or []:
        ids.add(member.user_id)
    return ids


def get_project_role(project: Project, user: User) -> str | None:
    if is_super_admin(user):
        return "super_admin"
    if project.owner_id == user.id:
        return "admin"
    for member in project.members or []:
        if member.user_id == user.id:
            return member.role
    if user.id in (project.member_ids or []):
        return "member"
    return None


def is_project_member(project: Project, user: User) -> bool:
    return is_super_admin(user) or get_project_role(project, user) is not None


def is_project_owner_or_admin(project: Project, user: User) -> bool:
    return is_super_admin(user) or get_project_role(project, user) == "admin"


def is_project_admin(project: Project, user: User) -> bool:
    return is_project_owner_or_admin(project, user)


def require_project_admin(project: Project, user: User) -> None:
    if not is_project_admin(project, user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Project admin access required")


async def get_project_or_404(project_id: PydanticObjectId) -> Project:
    project = await Project.get(project_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


async def get_task_or_404(task_id: PydanticObjectId) -> Task:
    task = await Task.get(task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task
