from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.user import User
from app.schemas.common import success, fail
from app.schemas.reservation import ReservationCreateRequest
from app.services import reservation_service

router = APIRouter(prefix="/reservations", tags=["reservations"])


def _reservation_to_dict(r) -> dict:
    return {
        "reservationId": r.reservation_id,
        "reservationNo": r.reservation_no,
        "userId": r.user_id,
        "spaceId": r.space_id,
        "policyId": r.policy_id,
        "reservationType": r.reservation_type,
        "startTime": r.start_time.isoformat() if r.start_time else None,
        "endTime": r.end_time.isoformat() if r.end_time else None,
        "reservationStatus": r.reservation_status,
        "chargeModeSnapshot": r.charge_mode_snapshot,
        "hourlyPriceSnapshot": float(r.hourly_price_snapshot),
        "freeMinutesSnapshot": r.free_minutes_snapshot,
        "maxReserveHoursSnapshot": r.max_reserve_hours_snapshot,
        "depositAmountSnapshot": float(r.deposit_amount_snapshot),
        "overtimeMultiplierSnapshot": float(r.overtime_multiplier_snapshot),
        "amountEstimated": float(r.amount_estimated),
        "cancelReason": r.cancel_reason,
        "cancelTime": r.cancel_time.isoformat() if r.cancel_time else None,
        "createdAt": r.created_at.isoformat() if r.created_at else None,
        "updatedAt": r.updated_at.isoformat() if r.updated_at else None,
    }


@router.post("")
def create_reservation(body: ReservationCreateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    target_user_id = body.userId if user.user_type == "ADMIN" else user.user_id
    try:
        reservation = reservation_service.create_reservation(
            db, target_user_id, body.spaceId, body.startTime, body.endTime,
            reservation_type="ADMIN" if user.user_type == "ADMIN" else "ONLINE",
        )
        db.commit()
        return success(_reservation_to_dict(reservation))
    except ValueError as e:
        return fail(400, str(e))


@router.get("/user/{user_id}")
def list_by_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_type != "ADMIN" and current_user.user_id != user_id:
        return fail(403, "无权访问")
    reservations = reservation_service.list_by_user(db, user_id)
    return success([_reservation_to_dict(r) for r in reservations])


@router.post("/{reservation_id}/cancel")
def cancel(reservation_id: int, body: dict = None, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reason = body.get("reason") if body else None
    try:
        reservation = reservation_service.cancel_reservation(db, reservation_id, reason)
        db.commit()
        return success(_reservation_to_dict(reservation))
    except ValueError as e:
        return fail(400, str(e))
