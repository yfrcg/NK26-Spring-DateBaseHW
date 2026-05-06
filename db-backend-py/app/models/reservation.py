from datetime import datetime
from decimal import Decimal
from sqlalchemy import BigInteger, String, Integer, DateTime, Numeric, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Reservation(Base):
    __tablename__ = "reservations"

    reservation_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    reservation_no: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    space_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    policy_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    reservation_type: Mapped[str] = mapped_column(
        SAEnum("ONLINE", "ADMIN", name="reservation_type_enum"),
        nullable=False, default="ONLINE",
    )
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    reservation_status: Mapped[str] = mapped_column(
        SAEnum("PENDING", "CONFIRMED", "CANCELLED", "IN_USE", "FINISHED", "NO_SHOW", name="reservation_status_enum"),
        nullable=False, default="CONFIRMED",
    )

    charge_mode_snapshot: Mapped[str] = mapped_column(
        SAEnum("FREE", "PAID", name="charge_mode_snap_enum"),
        nullable=False,
    )
    hourly_price_snapshot: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))
    free_minutes_snapshot: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    max_reserve_hours_snapshot: Mapped[int] = mapped_column(Integer, nullable=False)
    deposit_amount_snapshot: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))
    overtime_multiplier_snapshot: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, default=Decimal("1.50"))
    amount_estimated: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))

    cancel_reason: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cancel_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")


class SpaceTimeLock(Base):
    __tablename__ = "space_time_locks"

    lock_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    space_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    reservation_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    lock_segment_no: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    lock_type: Mapped[str] = mapped_column(
        SAEnum("RESERVATION", "TEMP_HOLD", name="lock_type_enum"),
        nullable=False,
    )
    lock_start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    lock_end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    lock_status: Mapped[str] = mapped_column(
        SAEnum("ACTIVE", "RELEASED", "EXPIRED", name="lock_status_enum"),
        nullable=False, default="ACTIVE",
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
