from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.user import User
from app.schemas.common import success, fail
from app.schemas.credit import CreditAdjustRequest
from app.services import credit_service

router = APIRouter(prefix="/credits", tags=["credits"])


def _credit_to_dict(c) -> dict:
    return {
        "creditTxnId": c.credit_txn_id,
        "userId": c.user_id,
        "reservationId": c.reservation_id,
        "sessionId": c.session_id,
        "eventType": c.event_type,
        "changeScore": c.change_score,
        "beforeScore": c.before_score,
        "afterScore": c.after_score,
        "operatorUserId": c.operator_user_id,
        "reasonText": c.reason_text,
        "createdAt": c.created_at.isoformat() if c.created_at else None,
    }


@router.get("/{user_id}/records")
def list_records(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_type != "ADMIN" and current_user.user_id != user_id:
        return fail(403, "无权访问")
    records = credit_service.list_by_user(db, user_id)
    return success([_credit_to_dict(r) for r in records])


@router.post("/{user_id}/adjust")
def adjust(user_id: int, body: CreditAdjustRequest, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        txn = credit_service.adjust_credit(
            db, user_id, body.changeScore, "MANUAL_ADJUST",
            operator_user_id=admin.user_id, reason=body.reason,
        )
        db.commit()
        return success(_credit_to_dict(txn))
    except ValueError as e:
        return fail(400, str(e))
