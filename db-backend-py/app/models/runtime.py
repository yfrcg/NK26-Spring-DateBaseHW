from datetime import datetime
from sqlalchemy import BigInteger, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SpaceRuntimeStatus(Base):
    __tablename__ = "space_runtime_status"

    space_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    current_status: Mapped[str] = mapped_column(
        SAEnum("IDLE", "RESERVED", "IN_USE", "TEMP_HOLD", "MAINTENANCE", name="runtime_status_enum"),
        nullable=False, default="IDLE",
    )
    current_reservation_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    current_session_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    status_since: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    hold_expire_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
