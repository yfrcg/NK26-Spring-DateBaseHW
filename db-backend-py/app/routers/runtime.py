from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import success
from app.services import runtime_service

router = APIRouter(prefix="/runtime", tags=["runtime"])


def _runtime_to_dict(r) -> dict:
    return {
        "spaceId": r.space_id,
        "currentStatus": r.current_status,
        "currentReservationId": r.current_reservation_id,
        "currentSessionId": r.current_session_id,
        "statusSince": r.status_since.isoformat() if r.status_since else None,
        "holdExpireTime": r.hold_expire_time.isoformat() if r.hold_expire_time else None,
        "createdAt": r.created_at.isoformat() if r.created_at else None,
        "updatedAt": r.updated_at.isoformat() if r.updated_at else None,
    }


@router.get("/spaces")
def list_spaces(db: Session = Depends(get_db)):
    statuses = runtime_service.list_all(db)
    return success([_runtime_to_dict(s) for s in statuses])
