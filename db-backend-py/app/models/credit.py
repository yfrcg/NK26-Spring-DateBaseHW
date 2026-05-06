from datetime import datetime
from sqlalchemy import BigInteger, String, Integer, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    credit_txn_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    reservation_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    session_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    event_type: Mapped[str] = mapped_column(
        SAEnum("NO_SHOW", "OVERTIME", "HOLD_TIMEOUT", "MANUAL_ADJUST", "MANUAL_RESTORE", name="credit_event_type_enum"),
        nullable=False,
    )
    change_score: Mapped[int] = mapped_column(Integer, nullable=False)
    before_score: Mapped[int] = mapped_column(Integer, nullable=False)
    after_score: Mapped[int] = mapped_column(Integer, nullable=False)
    operator_user_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    reason_text: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
