from datetime import datetime
from decimal import Decimal
from sqlalchemy import BigInteger, String, Integer, DateTime, Numeric, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class PricingPolicy(Base):
    __tablename__ = "pricing_policies"

    policy_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    policy_code: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    policy_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    charge_mode: Mapped[str] = mapped_column(
        SAEnum("FREE", "PAID", name="charge_mode_enum"),
        nullable=False,
    )
    hourly_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))
    free_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    max_reserve_hours: Mapped[int] = mapped_column(Integer, nullable=False, default=4)
    overtime_price_multiplier: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, default=Decimal("1.50"))
    allow_temp_hold: Mapped[int] = mapped_column(nullable=False, default=0)
    temp_hold_limit_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    temp_hold_max_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[int] = mapped_column(nullable=False, default=1)
    valid_from: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    valid_to: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    is_deleted: Mapped[int] = mapped_column(nullable=False, default=0)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    deleted_by: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
