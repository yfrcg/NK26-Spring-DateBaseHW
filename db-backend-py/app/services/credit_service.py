from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.models.credit import CreditTransaction
from app.models.user import User


def list_by_user(db: Session, user_id: int) -> list[CreditTransaction]:
    return (
        db.query(CreditTransaction)
        .filter(CreditTransaction.user_id == user_id)
        .order_by(CreditTransaction.created_at.desc())
        .all()
    )


def adjust_credit(
    db: Session,
    user_id: int,
    change_score: int,
    event_type: str,
    reservation_id: int = None,
    session_id: int = None,
    operator_user_id: int = None,
    reason: str = None,
) -> CreditTransaction:
    user = db.query(User).filter(User.user_id == user_id, User.is_deleted == 0).first()
    if not user:
        raise ValueError("用户不存在")

    before_score = user.credit_score
    after_score = max(0, min(1000, before_score + change_score))

    txn = CreditTransaction(
        user_id=user_id,
        reservation_id=reservation_id,
        session_id=session_id,
        event_type=event_type,
        change_score=change_score,
        before_score=before_score,
        after_score=after_score,
        operator_user_id=operator_user_id,
        reason_text=reason,
    )
    db.add(txn)

    user.credit_score = after_score
    user.updated_at = datetime.now()

    db.flush()
    return txn
