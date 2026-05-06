from sqlalchemy.orm import Session

from app.models.runtime import SpaceRuntimeStatus


def list_all(db: Session) -> list[SpaceRuntimeStatus]:
    return db.query(SpaceRuntimeStatus).all()
