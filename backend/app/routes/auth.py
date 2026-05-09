from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from typing import Annotated, List
from loguru import logger

from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, UserRole
from app.schemas import UserCreate, Token, UserResponse

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await User.find_one(User.email == email)
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate):
    user_exists = await User.find_one(User.email == user_in.email)
    if user_exists:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists",
        )

    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role,
        faculty_profile=user_in.faculty_profile,
        student_profile=user_in.student_profile,
    )
    await new_user.insert()

    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role,
        faculty_profile=new_user.faculty_profile,
        student_profile=new_user.student_profile,
    )


@router.post("/login", response_model=Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = await User.find_one(User.email == form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        faculty_profile=current_user.faculty_profile,
        student_profile=current_user.student_profile,
    )


@router.put("/me", response_model=UserResponse)
async def update_users_me(
    payload: dict,
    current_user: Annotated[User, Depends(get_current_user)],
):
    if "full_name" in payload:
        current_user.full_name = payload["full_name"]

    if current_user.role == UserRole.FACULTY and current_user.faculty_profile:
        if "department" in payload:
            current_user.faculty_profile.department = payload["department"]
        if "interests" in payload:
            current_user.faculty_profile.interests = payload["interests"]

    if current_user.role == UserRole.STUDENT and current_user.student_profile:
        if "department" in payload:
            current_user.student_profile.department = payload["department"]
        if "year" in payload:
            current_user.student_profile.year = payload["year"]
        if "skills" in payload:
            current_user.student_profile.skills = payload["skills"]

    await current_user.save()
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        faculty_profile=current_user.faculty_profile,
        student_profile=current_user.student_profile,
    )


@router.get("/students", response_model=List[UserResponse])
async def list_students(current_user: Annotated[User, Depends(get_current_user)]):
    if current_user.role != UserRole.FACULTY:
        raise HTTPException(status_code=403, detail="Only Faculty can view students")

    from app.models.project import Project
    from app.utils import get_link_id

    projects_with_teams = await Project.find({"team": {"$ne": None}}).to_list()
    assigned_map: dict = {}
    project_titles: dict = {}

    for p in projects_with_teams:
        project_titles[str(p.id)] = p.title
        if p.team:
            l_id = get_link_id(p.team.leader)
            if l_id:
                assigned_map[str(l_id)] = str(p.id)
            for m in p.team.members or []:
                m_id = get_link_id(m)
                if m_id:
                    assigned_map[str(m_id)] = str(p.id)

    students = await User.find(User.role == UserRole.STUDENT).to_list()
    return [
        UserResponse(
            id=str(s.id),
            email=s.email,
            full_name=s.full_name,
            role=s.role,
            faculty_profile=s.faculty_profile,
            student_profile=s.student_profile,
            is_assigned=str(s.id) in assigned_map,
            assigned_project_id=assigned_map.get(str(s.id)),
            assigned_project_title=project_titles.get(assigned_map.get(str(s.id))),
            completion_rate=await _get_project_progress(assigned_map.get(str(s.id)))
            if str(s.id) in assigned_map
            else 0,
        )
        for s in students
    ]


async def _get_project_progress(project_id: str) -> int:
    if not project_id:
        return 0
    from app.models.project import Project, TaskStatus

    p = await Project.get(project_id)
    if not p or not p.tasks:
        return 0
    done = len([t for t in p.tasks if t.status == TaskStatus.DONE])
    return int((done / len(p.tasks)) * 100)
