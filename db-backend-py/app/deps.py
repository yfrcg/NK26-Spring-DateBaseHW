from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.auth_service import token_store


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未登录")

    token = auth_header[7:]
    session = token_store.resolve(token)
    if not session:
        raise HTTPException(status_code=401, detail="登录已过期")

    user = db.query(User).filter(User.user_id == session.user_id, User.is_deleted == 0).first()
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.user_type != "ADMIN":
        raise HTTPException(status_code=403, detail="需要管理员权限")
    return user


def get_current_user_optional(request: Request, db: Session = Depends(get_db)) -> User | None:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header[7:]
    session = token_store.resolve(token)
    if not session:
        return None
    return db.query(User).filter(User.user_id == session.user_id, User.is_deleted == 0).first()
