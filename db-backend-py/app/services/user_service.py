from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.services.auth_service import hash_password, create_or_get_user_account


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.user_id == user_id, User.is_deleted == 0).first()


def get_user_by_no(db: Session, user_no: str) -> Optional[User]:
    return db.query(User).filter(User.user_no == user_no, User.is_deleted == 0).first()


def list_users(db: Session) -> list[User]:
    return db.query(User).filter(User.is_deleted == 0).all()


def create_user(db: Session, user_no: str, real_name: str, password: str,
                phone: str = None, email: str = None, user_type: str = "STUDENT") -> User:
    existing = get_user_by_no(db, user_no)
    if existing:
        raise ValueError("用户编号已存在")
    if phone:
        existing_phone = db.query(User).filter(User.phone == phone, User.is_deleted == 0).first()
        if existing_phone:
            raise ValueError("手机号已存在")
    if email:
        existing_email = db.query(User).filter(User.email == email, User.is_deleted == 0).first()
        if existing_email:
            raise ValueError("邮箱已存在")

    user = User(
        user_no=user_no,
        real_name=real_name,
        phone=phone,
        email=email,
        user_type=user_type,
        account_status="ACTIVE",
        credit_score=100,
        password_hash=hash_password(password),
    )
    db.add(user)
    db.flush()
    create_or_get_user_account(db, user.user_id)
    return user


def update_user_status(db: Session, user_id: int, status: str) -> User:
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("用户不存在")
    user.account_status = status
    user.updated_at = datetime.now()
    return user


def change_password(db: Session, user: User, current_password: str, new_password: str):
    from app.services.auth_service import verify_password
    if user.password_hash:
        if not verify_password(current_password, user.password_hash):
            raise ValueError("当前密码错误")
    else:
        if current_password != user.user_no:
            raise ValueError("当前密码错误")
    user.password_hash = hash_password(new_password)
    user.updated_at = datetime.now()
