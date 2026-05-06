import hashlib
import secrets
import time
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.config import settings
from app.models.user import User
from passlib.hash import pbkdf2_sha256, bcrypt


class AuthSession:
    def __init__(self, user_id: int, user_no: str, user_type: str, token: str, expire_at: float):
        self.user_id = user_id
        self.user_no = user_no
        self.user_type = user_type
        self.token = token
        self.expire_at = expire_at


class TokenStore:
    def __init__(self):
        self._sessions: dict[str, AuthSession] = {}

    def create_session(self, user: User) -> str:
        token = secrets.token_hex(32)
        expire_at = time.time() + settings.AUTH_TOKEN_TTL_HOURS * 3600
        session = AuthSession(
            user_id=user.user_id,
            user_no=user.user_no,
            user_type=user.user_type,
            token=token,
            expire_at=expire_at,
        )
        self._sessions[token] = session
        return token

    def resolve(self, token: str) -> Optional[AuthSession]:
        session = self._sessions.get(token)
        if session is None:
            return None
        if time.time() > session.expire_at:
            del self._sessions[token]
            return None
        return session

    def revoke(self, token: str):
        self._sessions.pop(token, None)


token_store = TokenStore()


def hash_password(password: str) -> str:
    return pbkdf2_sha256.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    if not hashed:
        return False
    if hashed.startswith("$2"):
        try:
            return bcrypt.verify(password, hashed)
        except Exception:
            return False
    try:
        return pbkdf2_sha256.verify(password, hashed)
    except Exception:
        return False


def authenticate_user(db: Session, user_no: str, password: str) -> Optional[User]:
    user = db.query(User).filter(User.user_no == user_no, User.is_deleted == 0).first()
    if user is None:
        return None
    if user.account_status == "SUSPENDED":
        return None
    if user.password_hash:
        if not verify_password(password, user.password_hash):
            return None
    else:
        if password != user_no:
            return None
    return user


def create_or_get_user_account(db: Session, user_id: int):
    from app.models.account import UserAccount
    account = db.query(UserAccount).filter(UserAccount.user_id == user_id).first()
    if account is None:
        account = UserAccount(user_id=user_id)
        db.add(account)
        db.flush()
    return account


def bootstrap_admin(db: Session):
    admin = db.query(User).filter(User.user_no == settings.BOOTSTRAP_ADMIN_USER_NO).first()
    if admin is None:
        admin = User(
            user_no=settings.BOOTSTRAP_ADMIN_USER_NO,
            real_name=settings.BOOTSTRAP_ADMIN_REAL_NAME,
            user_type="ADMIN",
            account_status="ACTIVE",
            credit_score=100,
            password_hash=hash_password(settings.BOOTSTRAP_ADMIN_PASSWORD),
        )
        db.add(admin)
        db.commit()
        create_or_get_user_account(db, admin.user_id)
        db.commit()
    else:
        if not verify_password(settings.BOOTSTRAP_ADMIN_PASSWORD, admin.password_hash):
            admin.password_hash = hash_password(settings.BOOTSTRAP_ADMIN_PASSWORD)
            db.commit()
