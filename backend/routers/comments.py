from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from dependencies import get_current_user, get_project_or_404, get_task_or_404, is_project_member
from models.comment import Comment
from models.task import TaskActivity
from models.user import User
from schemas.comment import CommentCreate, CommentOut

router = APIRouter(tags=["comments"])


async def serialize_comment(comment: Comment) -> CommentOut:
    author = await User.get(comment.author_id)
    return CommentOut(
        id=comment.id,
        body=comment.body,
        task_id=comment.task_id,
        author_id=comment.author_id,
        author_username=author.username if author else None,
        created_at=comment.created_at,
    )


@router.get("/api/tasks/{task_id}/comments", response_model=list[CommentOut])
async def list_comments(task_id: PydanticObjectId, current_user: User = Depends(get_current_user)) -> list[CommentOut]:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")
    comments = await Comment.find(Comment.task_id == task.id).sort("+created_at").to_list()
    return [await serialize_comment(comment) for comment in comments]


@router.post("/api/tasks/{task_id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
async def add_comment(
    task_id: PydanticObjectId,
    payload: CommentCreate,
    current_user: User = Depends(get_current_user),
) -> CommentOut:
    task = await get_task_or_404(task_id)
    project = await get_project_or_404(task.project_id)
    if not is_project_member(project, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Task access denied")
    comment = Comment(body=payload.body, task_id=task.id, author_id=current_user.id)
    await comment.insert()
    task.activity.append(TaskActivity(user_id=current_user.id, user_name=current_user.username, action="added a comment"))
    await task.save()
    return await serialize_comment(comment)


@router.delete("/api/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(comment_id: PydanticObjectId, current_user: User = Depends(get_current_user)) -> None:
    comment = await Comment.get(comment_id)
    if comment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can delete only your own comments")
    await comment.delete()
