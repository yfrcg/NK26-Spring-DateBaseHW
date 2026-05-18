import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy.orm import Session

from app.models.transaction import UserTransaction
from app.models.billing import BillingOrder
from app.models.user import User


def get_account_info(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.user_id == user_id, User.is_deleted == 0).first()


def get_transactions(db: Session, user_id: int, category: str = None) -> list[UserTransaction]:
    q = db.query(UserTransaction).filter(UserTransaction.user_id == user_id)
    if category:
        q = q.filter(UserTransaction.txn_category == category)
    return q.order_by(UserTransaction.created_at.desc()).all()


def recharge(db: Session, user_id: int, amount: float, operator_user_id: int = None) -> User:
    if amount <= 0:
        raise ValueError("充值金额必须大于0")

    user = db.query(User).filter(User.user_id == user_id, User.is_deleted == 0).first()
    if not user:
        raise ValueError("用户不存在")

    before_balance = float(user.balance)
    user.balance = Decimal(str(before_balance + amount))
    user.total_recharge = Decimal(str(float(user.total_recharge) + amount))
    user.updated_at = datetime.now()

    txn = UserTransaction(
        txn_no=f"TXN{uuid.uuid4().hex[:20].upper()}",
        user_id=user_id,
        txn_category="ACCOUNT",
        txn_type="RECHARGE",
        direction="IN",
        amount=Decimal(str(amount)),
        before_balance=Decimal(str(before_balance)),
        after_balance=user.balance,
        operator_user_id=operator_user_id,
        remark="用户充值",
    )
    db.add(txn)
    db.flush()

    settle_outstanding_bills(db, user_id, user)

    return user


def settle_outstanding_bills(db: Session, user_id: int, user: User):
    unpaid_bills = (
        db.query(BillingOrder)
        .filter(
            BillingOrder.user_id == user_id,
            BillingOrder.bill_status == "UNPAID",
        )
        .order_by(BillingOrder.created_at.asc())
        .all()
    )

    for bill in unpaid_bills:
        payable = float(bill.payable_amount)
        if float(user.balance) >= payable:
            before_balance = float(user.balance)
            user.balance = Decimal(str(before_balance - payable))
            user.total_spend = Decimal(str(float(user.total_spend) + payable))

            bill.bill_status = "PAID"
            bill.paid_amount = bill.payable_amount
            bill.settled_at = datetime.now()
            bill.updated_at = datetime.now()

            txn = UserTransaction(
                txn_no=f"TXN{uuid.uuid4().hex[:20].upper()}",
                user_id=user_id,
                reservation_id=bill.reservation_id,
                bill_id=bill.bill_id,
                txn_category="ACCOUNT",
                txn_type="CONSUME",
                direction="OUT",
                amount=Decimal(str(payable)),
                before_balance=Decimal(str(before_balance)),
                after_balance=user.balance,
                remark="自动结账",
            )
            db.add(txn)

    has_unpaid = (
        db.query(BillingOrder)
        .filter(BillingOrder.user_id == user_id, BillingOrder.bill_status == "UNPAID")
        .first()
    )
    if not has_unpaid and user.account_status == "ARREARS_LOCKED":
        user.account_status = "ACTIVE"
        user.updated_at = datetime.now()


def create_bill_and_try_pay(
    db: Session,
    reservation_id: int,
    user_id: int,
    base_amount: float,
    overtime_amount: float,
    discount_amount: float = 0.0,
) -> BillingOrder:
    payable = base_amount + overtime_amount - discount_amount
    payable = max(payable, 0)

    bill = BillingOrder(
        bill_no=f"BILL{uuid.uuid4().hex[:20].upper()}",
        reservation_id=reservation_id,
        user_id=user_id,
        base_amount=Decimal(str(base_amount)),
        overtime_amount=Decimal(str(overtime_amount)),
        discount_amount=Decimal(str(discount_amount)),
        payable_amount=Decimal(str(payable)),
    )

    user = db.query(User).filter(User.user_id == user_id, User.is_deleted == 0).first()
    if user and float(user.balance) >= payable and payable > 0:
        before_balance = float(user.balance)
        user.balance = Decimal(str(before_balance - payable))
        user.total_spend = Decimal(str(float(user.total_spend) + payable))

        bill.bill_status = "PAID"
        bill.paid_amount = Decimal(str(payable))
        bill.settled_at = datetime.now()

        txn = UserTransaction(
            txn_no=f"TXN{uuid.uuid4().hex[:20].upper()}",
            user_id=user_id,
            reservation_id=reservation_id,
            txn_category="ACCOUNT",
            txn_type="CONSUME",
            direction="OUT",
            amount=Decimal(str(payable)),
            before_balance=Decimal(str(before_balance)),
            after_balance=user.balance,
            remark="预约结账",
        )
        db.add(txn)
    else:
        bill.bill_status = "UNPAID"
        if user and user.account_status == "ACTIVE":
            user.account_status = "ARREARS_LOCKED"
            user.updated_at = datetime.now()

    db.add(bill)
    db.flush()
    return bill
