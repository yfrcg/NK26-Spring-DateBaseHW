from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.user import User
from app.schemas.common import success, fail
from app.schemas.user import UserCreateRequest
from app.services import user_service
from app.routers.auth import _user_to_dict

router = APIRouter(prefix="/users", tags=["users"])


@router.post("")
def create_user(body: UserCreateRequest, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        user_type = body.userType if body.userType in ("STUDENT", "TEACHER", "ADMIN") else "STUDENT"
        user = user_service.create_user(
            db,
            user_no=body.userNo,
            real_name=body.realName,
            password=body.password,
            phone=body.phone,
            email=body.email,
            user_type=user_type,
        )
        db.commit()
        return success(_user_to_dict(user))
    except ValueError as e:
        return fail(400, str(e))


@router.get("")
def list_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    users = user_service.list_users(db)
    return success([_user_to_dict(u) for u in users])


@router.get("/{user_id}")
def get_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_type != "ADMIN" and current_user.user_id != user_id:
        return fail(403, "无权访问")
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        return fail(404, "用户不存在")
    return success(_user_to_dict(user))
