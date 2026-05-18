from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import success
from app.services import space_service

router = APIRouter(prefix="/spaces", tags=["spaces"])


def _space_to_dict(space) -> dict:
    return {
        "spaceId": space.space_id,
        "locationId": space.location_id,
        "policyId": space.policy_id,
        "spaceCode": space.space_code,
        "spaceName": space.space_name,
        "spaceType": space.space_type,
        "capacity": space.capacity,
        "equipmentDesc": space.equipment_desc,
        "status": space.status,
        "sortNo": space.sort_no,
        "createdAt": space.created_at.isoformat() if space.created_at else None,
        "updatedAt": space.updated_at.isoformat() if space.updated_at else None,
        "isDeleted": space.is_deleted,
    }


@router.get("/active")
def list_active(db: Session = Depends(get_db)):
    spaces = space_service.list_active_spaces(db)
    return success([_space_to_dict(s) for s in spaces])
