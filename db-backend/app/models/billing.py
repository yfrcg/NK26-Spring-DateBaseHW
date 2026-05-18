from datetime import datetime
from decimal import Decimal
from sqlalchemy import BigInteger, String, DateTime, Numeric, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class BillingOrder(Base):
    __tablename__ = "billing_orders"

    bill_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    bill_no: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    reservation_id: Mapped[int] = mapped_column(BigInteger, unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    bill_status: Mapped[str] = mapped_column(
        SAEnum("UNPAID", "PAID", "WAIVED", "CANCELLED", name="bill_status_enum"),
        nullable=False, default="UNPAID",
    )

    base_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))
    overtime_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))
    payable_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))
    paid_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))

    settled_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default="CURRENT_TIMESTAMP")
