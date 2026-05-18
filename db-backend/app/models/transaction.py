from datetime import datetime
from decimal import Decimal
from sqlalchemy import BigInteger, String, Integer, DateTime, Numeric, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UserTransaction(Base):
    __tablename__ = "user_transactions"

    txn_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    txn_no: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    reservation_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    bill_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    session_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)

    txn_category: Mapped[str] = mapped_column(
        SAEnum("ACCOUNT", "CREDIT", name="txn_category_enum"),
        nullable=False,
    )
    txn_type: Mapped[str] = mapped_column(
        SAEnum("RECHARGE", "CONSUME", "REFUND", "ADJUST", "NO_SHOW", "OVERTIME", "HOLD_TIMEOUT", "MANUAL_RESTORE", name="txn_type_enum"),
        nullable=False,
    )
    direction: Mapped[str] = mapped_column(
        SAEnum("IN", "OUT", "NONE", name="direction_enum"),
        nullable=False, default="NONE",
    )

    amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    before_balance: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    after_balance: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)

    credit_delta: Mapped[int | None] = mapped_column(Integer, nullable=True)
    before_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    after_score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    operator_user_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    remark: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
