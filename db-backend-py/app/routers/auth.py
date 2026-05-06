from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas.common import success, fail
from app.schemas.user import LoginRequest, RegisterRequest, ChangePasswordRequest
from app.services import auth_service, user_service
from app.services.auth_service import token_store

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_to_dict(user: User) -> dict:
    return {
        "userId": user.user_id,
        "userNo": user.user_no,
        "realName": user.real_name,
        "phone": user.phone,
        "email": user.email,
        "userType": user.user_type,
        "accountStatus": user.account_status,
        "creditScore": user.credit_score,
        "lastLoginTime": user.last_login_time.isoformat() if user.last_login_time else None,
        "createdAt": user.created_at.isoformat() if user.created_at else None,
        "updatedAt": user.updated_at.isoformat() if user.updated_at else None,
        "isDeleted": user.is_deleted,
        "deletedAt": user.deleted_at.isoformat() if user.deleted_at else None,
        "deletedBy": user.deleted_by,
    }


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, body.userNo, body.password)
    if not user:
        return fail(401, "用户名或密码错误")

    user.last_login_time = datetime.now()
    db.commit()

    token = token_store.create_session(user)
    return success({"token": token, "user": _user_to_dict(user)})


@router.post("/register")
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    try:
        user_type = body.userType if body.userType in ("STUDENT", "TEACHER") else "STUDENT"
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
        token = token_store.create_session(user)
        return success({"token": token, "user": _user_to_dict(user)})
    except ValueError as e:
        return fail(400, str(e))


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return success(_user_to_dict(user))


@router.post("/change-password")
def change_password(body: ChangePasswordRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        user_service.change_password(db, user, body.currentPassword, body.newPassword)
        db.commit()
        return success(_user_to_dict(user))
    except ValueError as e:
        return fail(400, str(e))


@router.post("/logout")
def logout(user: User = Depends(get_current_user)):
    return success(None)
