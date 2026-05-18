from datetime import datetime
from sqlalchemy import BigInteger, String, Integer, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Space(Base):
    __tablename__ = "spaces"

    space_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    location_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    policy_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    space_code: Mapped[str] = mapped_column(String(30), nullable=False)
    space_name: Mapped[str] = mapped_column(String(100), nullable=False)
    space_type: Mapped[str] = mapped_column(
        SAEnum("SEAT", "DESK", "ROOM", "OFFICE", name="space_type_enum"),
        nullable=False,
    )
    capacity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    equipment_desc: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        SAEnum("ACTIVE", "MAINTENANCE", "DISABLED", name="space_status_enum"),
        nullable=False, default="ACTIVE",
    )
    sort_no: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    is_deleted: Mapped[int] = mapped_column(nullable=False, default=0)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    deleted_by: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
