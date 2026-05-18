import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.transaction import UserTransaction


def get_user_credits(db: Session, user_id: int) -> int:
    user = db.query(User).filter(User.user_id == user_id, User.is_deleted == 0).first()
    return user.credit_score if user else 0


def get_credit_transactions(db: Session, user_id: int) -> list[UserTransaction]:
    return (
        db.query(UserTransaction)
        .filter(UserTransaction.user_id == user_id, UserTransaction.txn_category == "CREDIT")
        .order_by(UserTransaction.created_at.desc())
        .all()
    )


def update_credit_score(
    db: Session,
    user_id: int,
    change_score: int,
    txn_type: str,
    operator_user_id: Optional[int] = None,
    remark: Optional[str] = None,
    reservation_id: Optional[int] = None,
) -> User:
    user = db.query(User).filter(User.user_id == user_id, User.is_deleted == 0).first()
    if not user:
        raise ValueError("用户不存在")

    before_score = user.credit_score
    new_score = before_score + change_score
    if new_score < 0:
        new_score = 0
    if new_score > 100:
        new_score = 100
    user.credit_score = new_score
    user.updated_at = datetime.now()

    direction = "NONE"
    if change_score > 0:
        direction = "IN"
    elif change_score < 0:
        direction = "OUT"

    txn = UserTransaction(
        txn_no=f"TXN{uuid.uuid4().hex[:20].upper()}",
        user_id=user_id,
        reservation_id=reservation_id,
        txn_category="CREDIT",
        txn_type=txn_type,
        direction=direction,
        credit_delta=change_score,
        before_score=before_score,
        after_score=new_score,
        operator_user_id=operator_user_id,
        remark=remark,
    )
    db.add(txn)
    db.flush()

    return user
