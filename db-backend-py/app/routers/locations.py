from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.user import User
from app.schemas.common import success, fail
from app.schemas.location import LocationCreateRequest
from app.services import location_service
from app.routers.spaces import _space_to_dict

router = APIRouter(prefix="/locations", tags=["locations"])


@router.get("/tree")
def get_tree(db: Session = Depends(get_db)):
    tree = location_service.get_tree(db)
    return success(tree)


@router.get("/{location_id}/spaces")
def list_spaces(location_id: int, db: Session = Depends(get_db)):
    spaces = location_service.list_spaces_by_location(db, location_id)
    return success([_space_to_dict(s) for s in spaces])


@router.post("")
def create_location(body: LocationCreateRequest, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    try:
        loc = location_service.create_location(db, body.model_dump(by_alias=False))
        db.commit()
        return success({
            "locationId": loc.location_id,
            "parentLocationId": loc.parent_location_id,
            "locationCode": loc.location_code,
            "locationName": loc.location_name,
            "locationType": loc.location_type,
            "floorNo": loc.floor_no,
            "roomNo": loc.room_no,
            "openTime": str(loc.open_time),
            "closeTime": str(loc.close_time),
            "status": loc.status,
            "remarks": loc.remarks,
            "createdAt": loc.created_at.isoformat() if loc.created_at else None,
            "updatedAt": loc.updated_at.isoformat() if loc.updated_at else None,
            "isDeleted": loc.is_deleted,
        })
    except Exception as e:
        return fail(400, str(e))
