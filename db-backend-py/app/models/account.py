from datetime import datetime
from decimal import Decimal
from sqlalchemy import BigInteger, String, Integer, DateTime, Numeric, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UserAccount(Base):
    __tablename__ = "user_accounts"

    user_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    balance: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    frozen_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    arrears_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    total_recharge: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    total_spend: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=Decimal("0.00"))
    version_no: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_settlement_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")


class AccountTransaction(Base):
    __tablename__ = "account_transactions"

    txn_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    txn_no: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    account_user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    reservation_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    bill_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    txn_type: Mapped[str] = mapped_column(
        SAEnum("RECHARGE", "CONSUME", "REFUND", "ADJUST", name="txn_type_enum"),
        nullable=False,
    )
    direction: Mapped[str] = mapped_column(
        SAEnum("IN", "OUT", name="direction_enum"),
        nullable=False,
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    before_balance: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    after_balance: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    operator_user_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    remark: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
