from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import func, case, literal
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.space import Space
from app.models.reservation import Reservation
from app.models.billing import BillingOrder
from app.models.session import UsageSession
from app.models.transaction import UserTransaction


def get_dashboard_data(db: Session) -> dict:
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())

    today_revenue = (
        db.query(func.sum(UserTransaction.amount))
        .filter(
            UserTransaction.txn_category == "ACCOUNT",
            UserTransaction.direction == "OUT",
            UserTransaction.created_at.between(today_start, today_end),
        )
        .scalar()
    ) or Decimal("0")

    today_recharge = (
        db.query(func.sum(UserTransaction.amount))
        .filter(
            UserTransaction.txn_category == "ACCOUNT",
            UserTransaction.direction == "IN",
            UserTransaction.created_at.between(today_start, today_end),
        )
        .scalar()
    ) or Decimal("0")

    unpaid_count = (
        db.query(func.count(BillingOrder.bill_id))
        .filter(BillingOrder.bill_status == "UNPAID")
        .scalar()
    )

    active_user_count = (
        db.query(func.count(User.user_id))
        .filter(User.is_deleted == 0, User.account_status == "ACTIVE")
        .scalar()
    )

    today_reservations = (
        db.query(func.count(Reservation.reservation_id))
        .filter(Reservation.created_at.between(today_start, today_end))
        .scalar()
    )

    today_check_ins = (
        db.query(func.count(UsageSession.session_id))
        .filter(UsageSession.check_in_time.between(today_start, today_end))
        .scalar()
    )

    today_no_show = (
        db.query(func.count(Reservation.reservation_id))
        .filter(
            Reservation.created_at.between(today_start, today_end),
            Reservation.reservation_status == "NO_SHOW",
        )
        .scalar()
    )

    top_spaces = get_top_spaces(db, today_start, today_end)
    credit_events = get_credit_event_stats(db, today_start, today_end)

    return {
        "todayReservationCount": today_reservations,
        "todayCheckInCount": today_check_ins,
        "todayRevenue": float(today_revenue),
        "unpaidBillCount": unpaid_count,
        "activeUserCount": active_user_count,
        "todayNoShowCount": today_no_show,
        "todayRechargeAmount": float(today_recharge),
        "todayConsumeAmount": float(today_revenue),
        "topSpaces": top_spaces,
        "creditEvents": credit_events,
    }


def get_top_spaces(
    db: Session, start: datetime, end: datetime, limit: int = 5
) -> list[dict]:
    rows = (
        db.query(
            Reservation.space_id,
            Space.space_name,
            func.count(Reservation.reservation_id).label("reservation_count"),
        )
        .join(Space, Space.space_id == Reservation.space_id)
        .filter(Reservation.created_at.between(start, end))
        .group_by(Reservation.space_id, Space.space_name)
        .order_by(func.count(Reservation.reservation_id).desc())
        .limit(limit)
        .all()
    )
    return [
        {"spaceId": r[0], "spaceName": r[1], "reservationCount": r[2]}
        for r in rows
    ]


def get_credit_event_stats(
    db: Session, start: datetime, end: datetime
) -> list[dict]:
    rows = (
        db.query(
            UserTransaction.txn_type,
            func.count(UserTransaction.txn_id).label("event_count"),
            func.sum(
                case((UserTransaction.direction == "OUT", UserTransaction.credit_delta), else_=0)
            ).label("total_deducted"),
            func.sum(
                case((UserTransaction.direction == "IN", UserTransaction.credit_delta), else_=0)
            ).label("total_restored"),
        )
        .filter(
            UserTransaction.txn_category == "CREDIT",
            UserTransaction.created_at.between(start, end),
        )
        .group_by(UserTransaction.txn_type)
        .all()
    )
    return [
        {
            "eventType": r[0],
            "eventCount": r[1],
            "totalDeducted": abs(int(r[2] or 0)),
            "totalRestored": int(r[3] or 0),
        }
        for r in rows
    ]
