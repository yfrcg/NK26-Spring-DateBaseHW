from datetime import datetime
from sqlalchemy import BigInteger, String, Integer, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UsageSession(Base):
    __tablename__ = "usage_sessions"

    session_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    reservation_id: Mapped[int] = mapped_column(BigInteger, unique=True, nullable=False)
    check_in_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    check_out_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    actual_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    overtime_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    hold_start_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    hold_expire_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    hold_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_hold_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    session_status: Mapped[str] = mapped_column(
        SAEnum("NOT_STARTED", "IN_USE", "TEMP_HOLD", "ENDED", "ABNORMAL", name="session_status_enum"),
        nullable=False, default="NOT_STARTED",
    )
    operator_user_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    notes: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
