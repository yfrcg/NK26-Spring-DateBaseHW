from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas.common import success, fail
from app.services import billing_service

router = APIRouter(prefix="/bills", tags=["bills"])


def _bill_to_dict(b) -> dict:
    return {
        "billId": b.bill_id,
        "billNo": b.bill_no,
        "reservationId": b.reservation_id,
        "userId": b.user_id,
        "billStatus": b.bill_status,
        "baseAmount": float(b.base_amount),
        "overtimeAmount": float(b.overtime_amount),
        "discountAmount": float(b.discount_amount),
        "payableAmount": float(b.payable_amount),
        "paidAmount": float(b.paid_amount),
        "settledAt": b.settled_at.isoformat() if b.settled_at else None,
        "remarks": b.remarks,
        "createdAt": b.created_at.isoformat() if b.created_at else None,
        "updatedAt": b.updated_at.isoformat() if b.updated_at else None,
    }


@router.get("/reservation/{reservation_id}")
def get_by_reservation(reservation_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bill = billing_service.get_by_reservation(db, reservation_id)
    if not bill:
        return fail(404, "账单不存在")
    if user.user_type != "ADMIN" and bill.user_id != user.user_id:
        return fail(403, "无权访问")
    return success(_bill_to_dict(bill))


@router.get("/user/{user_id}")
def list_by_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_type != "ADMIN" and current_user.user_id != user_id:
        return fail(403, "无权访问")
    bills = billing_service.list_by_user(db, user_id)
    return success([_bill_to_dict(b) for b in bills])
