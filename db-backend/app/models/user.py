from datetime import datetime
from decimal import Decimal
from sqlalchemy import BigInteger, String, Integer, DateTime, Numeric, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    real_name: Mapped[str] = mapped_column(String(50), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    phone: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)
    email: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True)
    user_type: Mapped[str] = mapped_column(
        SAEnum("STUDENT", "TEACHER", "ADMIN", name="user_type_enum"),
        nullable=False, default="STUDENT",
    )
    account_status: Mapped[str] = mapped_column(
        SAEnum("ACTIVE", "SUSPENDED", "ARREARS_LOCKED", name="account_status_enum"),
        nullable=False, default="ACTIVE",
    )

    balance: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    arrears_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    total_recharge: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    total_spend: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    credit_score: Mapped[int] = mapped_column(Integer, nullable=False, default=100)

    last_login_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    is_deleted: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    deleted_by: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
