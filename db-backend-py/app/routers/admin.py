from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models.user import User
from app.schemas.common import success, fail
from app.schemas.credit import CreditAdjustRequest
from app.services import user_service, space_service, reservation_service, credit_service, pricing_service
from app.routers.auth import _user_to_dict
from app.routers.spaces import _space_to_dict
from app.routers.reservations import _reservation_to_dict
from app.routers.credits import _credit_to_dict

router = APIRouter(prefix="/admin", tags=["admin"])


def _policy_to_dict(p) -> dict:
    return {
        "policyId": p.policy_id,
        "policyCode": p.policy_code,
        "policyName": p.policy_name,
        "chargeMode": p.charge_mode,
        "hourlyPrice": float(p.hourly_price),
        "freeMinutes": p.free_minutes,
        "maxReserveHours": p.max_reserve_hours,
        "depositAmount": float(p.deposit_amount),
        "overtimePriceMultiplier": float(p.overtime_price_multiplier),
        "allowTempHold": p.allow_temp_hold,
        "tempHoldLimitMinutes": p.temp_hold_limit_minutes,
        "tempHoldMaxCount": p.temp_hold_max_count,
        "isActive": p.is_active,
        "validFrom": p.valid_from.isoformat() if p.valid_from else None,
        "validTo": p.valid_to.isoformat() if p.valid_to else None,
        "remarks": p.remarks,
        "createdAt": p.created_at.isoformat() if p.created_at else None,
        "updatedAt": p.updated_at.isoformat() if p.updated_at else None,
        "isDeleted": p.is_deleted,
    }


@router.get("/users")
def list_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    users = user_service.list_users(db)
    return success([_user_to_dict(u) for u in users])


@router.post("/users/{user_id}/suspend")
def suspend_user(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        user = user_service.update_user_status(db, user_id, "SUSPENDED")
        db.commit()
        return success(_user_to_dict(user))
    except ValueError as e:
        return fail(400, str(e))


@router.post("/users/{user_id}/activate")
def activate_user(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        user = user_service.update_user_status(db, user_id, "ACTIVE")
        db.commit()
        return success(_user_to_dict(user))
    except ValueError as e:
        return fail(400, str(e))


@router.get("/spaces")
def list_spaces(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    spaces = space_service.list_all_spaces(db)
    return success([_space_to_dict(s) for s in spaces])


@router.post("/spaces/{space_id}/disable")
def disable_space(space_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        space = space_service.update_space_status(db, space_id, "DISABLED")
        db.commit()
        return success(_space_to_dict(space))
    except ValueError as e:
        return fail(400, str(e))


@router.post("/spaces/{space_id}/activate")
def activate_space(space_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        space = space_service.update_space_status(db, space_id, "ACTIVE")
        db.commit()
        return success(_space_to_dict(space))
    except ValueError as e:
        return fail(400, str(e))


@router.post("/spaces/{space_id}/maintenance")
def maintenance_space(space_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        space = space_service.update_space_status(db, space_id, "MAINTENANCE")
        db.commit()
        return success(_space_to_dict(space))
    except ValueError as e:
        return fail(400, str(e))


@router.get("/reservations")
def list_reservations(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    reservations = reservation_service.list_all(db)
    return success([_reservation_to_dict(r) for r in reservations])


@router.post("/reservations/{reservation_id}/cancel")
def cancel_reservation(reservation_id: int, body: dict = None, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    reason = body.get("reason") if body else None
    try:
        reservation = reservation_service.cancel_reservation(db, reservation_id, reason)
        db.commit()
        return success(_reservation_to_dict(reservation))
    except ValueError as e:
        return fail(400, str(e))


@router.post("/credits/{user_id}/adjust")
def adjust_credit(user_id: int, body: CreditAdjustRequest, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        txn = credit_service.adjust_credit(
            db, user_id, body.changeScore, "MANUAL_ADJUST",
            operator_user_id=admin.user_id, reason=body.reason,
        )
        db.commit()
        return success(_credit_to_dict(txn))
    except ValueError as e:
        return fail(400, str(e))


@router.get("/policies")
def list_policies(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    policies = pricing_service.list_policies(db)
    return success([_policy_to_dict(p) for p in policies])


@router.post("/policies/{policy_id}/enable")
def enable_policy(policy_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        policy = pricing_service.update_policy_active(db, policy_id, 1)
        db.commit()
        return success(_policy_to_dict(policy))
    except ValueError as e:
        return fail(400, str(e))


@router.post("/policies/{policy_id}/disable")
def disable_policy(policy_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        policy = pricing_service.update_policy_active(db, policy_id, 0)
        db.commit()
        return success(_policy_to_dict(policy))
    except ValueError as e:
        return fail(400, str(e))
