from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.reservation import Reservation
from app.schemas.common import success, fail
from app.services import session_service

router = APIRouter(prefix="/sessions", tags=["sessions"])


def _session_to_dict(s) -> dict:
    return {
        "sessionId": s.session_id,
        "reservationId": s.reservation_id,
        "checkInTime": s.check_in_time.isoformat() if s.check_in_time else None,
        "checkOutTime": s.check_out_time.isoformat() if s.check_out_time else None,
        "actualMinutes": s.actual_minutes,
        "overtimeMinutes": s.overtime_minutes,
        "holdStartTime": s.hold_start_time.isoformat() if s.hold_start_time else None,
        "holdExpireTime": s.hold_expire_time.isoformat() if s.hold_expire_time else None,
        "holdCount": s.hold_count,
        "sessionStatus": s.session_status,
        "operatorUserId": s.operator_user_id,
        "notes": s.notes,
        "createdAt": s.created_at.isoformat() if s.created_at else None,
        "updatedAt": s.updated_at.isoformat() if s.updated_at else None,
    }


def _check_owner_or_admin(db: Session, user: User, reservation_id: int):
    reservation = db.query(Reservation).filter(Reservation.reservation_id == reservation_id).first()
    if not reservation:
        raise ValueError("预约不存在")
    if user.user_type != "ADMIN" and reservation.user_id != user.user_id:
        raise PermissionError("无权操作")


@router.post("/{reservation_id}/check-in")
def check_in(reservation_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        _check_owner_or_admin(db, user, reservation_id)
        session = session_service.check_in(db, reservation_id, user.user_id)
        db.commit()
        return success(_session_to_dict(session))
    except (ValueError, PermissionError) as e:
        return fail(400, str(e))


@router.post("/{reservation_id}/temp-hold")
def temp_hold(reservation_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        _check_owner_or_admin(db, user, reservation_id)
        session = session_service.temp_hold(db, reservation_id)
        db.commit()
        return success(_session_to_dict(session))
    except (ValueError, PermissionError) as e:
        return fail(400, str(e))


@router.post("/{reservation_id}/resume")
def resume(reservation_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        _check_owner_or_admin(db, user, reservation_id)
        session = session_service.resume(db, reservation_id)
        db.commit()
        return success(_session_to_dict(session))
    except (ValueError, PermissionError) as e:
        return fail(400, str(e))


@router.post("/{reservation_id}/check-out")
def check_out(reservation_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        _check_owner_or_admin(db, user, reservation_id)
        session = session_service.check_out(db, reservation_id, user.user_id)
        db.commit()
        return success(_session_to_dict(session))
    except (ValueError, PermissionError) as e:
        return fail(400, str(e))


@router.get("/reservation/{reservation_id}")
def get_by_reservation(reservation_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        _check_owner_or_admin(db, user, reservation_id)
    except (ValueError, PermissionError) as e:
        return fail(403, str(e))
    session = session_service.get_session_by_reservation(db, reservation_id)
    if not session:
        return fail(404, "使用记录不存在")
    return success(_session_to_dict(session))
