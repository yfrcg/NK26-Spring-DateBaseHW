from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.models.location import Location
from app.models.space import Space


def get_tree(db: Session) -> list[dict]:
    locations = db.query(Location).filter(Location.is_deleted == 0).all()
    loc_map = {}
    roots = []
    for loc in locations:
        node = {
            "locationId": loc.location_id,
            "parentLocationId": loc.parent_location_id,
            "locationCode": loc.location_code,
            "locationName": loc.location_name,
            "locationType": loc.location_type,
            "floorNo": loc.floor_no,
            "roomNo": loc.room_no,
            "status": loc.status,
            "children": [],
        }
        loc_map[loc.location_id] = node

    for loc in locations:
        node = loc_map[loc.location_id]
        if loc.parent_location_id and loc.parent_location_id in loc_map:
            loc_map[loc.parent_location_id]["children"].append(node)
        else:
            roots.append(node)

    return roots


def list_spaces_by_location(db: Session, location_id: int) -> list[Space]:
    location = db.query(Location).filter(Location.location_id == location_id, Location.is_deleted == 0).first()
    if not location:
        return []

    all_location_ids = _collect_child_ids(db, location_id)
    all_location_ids.append(location_id)

    return (
        db.query(Space)
        .filter(Space.location_id.in_(all_location_ids), Space.is_deleted == 0)
        .all()
    )


def _collect_child_ids(db: Session, parent_id: int) -> list[int]:
    children = db.query(Location).filter(
        Location.parent_location_id == parent_id,
        Location.is_deleted == 0,
    ).all()
    result = []
    for child in children:
        result.append(child.location_id)
        result.extend(_collect_child_ids(db, child.location_id))
    return result


def create_location(db: Session, data: dict) -> Location:
    loc = Location(
        parent_location_id=data.get("parentLocationId"),
        location_code=data["locationCode"],
        location_name=data["locationName"],
        location_type=data["locationType"],
        floor_no=data.get("floorNo"),
        room_no=data.get("roomNo"),
        open_time=data["openTime"],
        close_time=data["closeTime"],
        status="ACTIVE",
        remarks=data.get("remarks"),
    )
    db.add(loc)
    db.flush()
    return loc
