from fastapi import APIRouter, HTTPException, status
from beanie import PydanticObjectId
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt

from config import get_settings
from models.user import User
from schemas.user import AccessToken, RefreshRequest, Token, UserCreate, UserOut
from security import create_access_token, create_refresh_token, get_password_hash, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate) -> User:
    existing_email = await User.find_one(User.email == payload.email)
    if existing_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    existing_username = await User.find_one(User.username == payload.username)
    if existing_username:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already taken")

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=get_password_hash(payload.password),
        role="member",
    )
    await user.insert()
    return user


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    user = await User.find_one(User.email == form_data.username)
    if user is None:
        user = await User.find_one(User.username == form_data.username)
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return Token(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        user=UserOut.model_validate(user),
    )


@router.post("/refresh", response_model=AccessToken)
async def refresh(payload: RefreshRequest) -> AccessToken:
    settings = get_settings()
    try:
        decoded = jwt.decode(payload.refresh_token, settings.secret_key, algorithms=[settings.algorithm])
        user_id = decoded.get("sub")
        token_type = decoded.get("type")
        if user_id is None or token_type != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    user = await User.get(PydanticObjectId(user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    return AccessToken(access_token=create_access_token(str(user.id)))
