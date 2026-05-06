from datetime import datetime
from sqlalchemy import BigInteger, String, DateTime, Time, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Location(Base):
    __tablename__ = "locations"

    location_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    parent_location_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    location_code: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    location_name: Mapped[str] = mapped_column(String(100), nullable=False)
    location_type: Mapped[str] = mapped_column(
        SAEnum("BUILDING", "ZONE", "ROOM", name="location_type_enum"),
        nullable=False,
    )
    floor_no: Mapped[str | None] = mapped_column(String(10), nullable=True)
    room_no: Mapped[str | None] = mapped_column(String(20), nullable=True)
    open_time = mapped_column(Time, nullable=False)
    close_time = mapped_column(Time, nullable=False)
    status: Mapped[str] = mapped_column(
        SAEnum("ACTIVE", "INACTIVE", name="location_status_enum"),
        nullable=False, default="ACTIVE",
    )
    remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    is_deleted: Mapped[int] = mapped_column(nullable=False, default=0)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    deleted_by: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
