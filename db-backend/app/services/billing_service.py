from typing import Optional

from sqlalchemy.orm import Session

from app.models.billing import BillingOrder


def get_by_reservation(db: Session, reservation_id: int) -> Optional[BillingOrder]:
    return db.query(BillingOrder).filter(BillingOrder.reservation_id == reservation_id).first()


def list_by_user(db: Session, user_id: int) -> list[BillingOrder]:
    return (
        db.query(BillingOrder)
        .filter(BillingOrder.user_id == user_id)
        .order_by(BillingOrder.created_at.desc())
        .all()
    )
