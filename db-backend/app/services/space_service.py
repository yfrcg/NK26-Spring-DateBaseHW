from sqlalchemy.orm import Session

from app.models.space import Space


def list_active_spaces(db: Session) -> list[Space]:
    return (
        db.query(Space)
        .filter(Space.is_deleted == 0, Space.status == "ACTIVE")
        .all()
    )


def get_space_by_id(db: Session, space_id: int) -> Space | None:
    return db.query(Space).filter(Space.space_id == space_id, Space.is_deleted == 0).first()


def list_all_spaces(db: Session) -> list[Space]:
    return db.query(Space).filter(Space.is_deleted == 0).all()


def update_space_status(db: Session, space_id: int, status: str) -> Space:
    space = get_space_by_id(db, space_id)
    if not space:
        raise ValueError("空间不存在")
    space.status = status
    return space
