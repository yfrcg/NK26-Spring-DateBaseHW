from datetime import datetime
from sqlalchemy.orm import Session

from app.models.session import UsageSession
from app.models.reservation import Reservation
from app.models.pricing import PricingPolicy
from app.services import reservation_service


def get_session_by_reservation_id(db: Session, reservation_id: int) -> UsageSession | None:
    return db.query(UsageSession).filter(UsageSession.reservation_id == reservation_id).first()


def get_session_by_id(db: Session, session_id: int) -> UsageSession | None:
    return db.query(UsageSession).filter(UsageSession.session_id == session_id).first()


def check_in(db: Session, reservation_id: int, user_id: int = None) -> UsageSession:
    reservation = reservation_service.get_reservation_by_id(db, reservation_id)
    if not reservation:
        raise ValueError("预约不存在")
    if reservation.reservation_status != "CONFIRMED":
        raise ValueError(f"当前预约状态({reservation.reservation_status})不允许签到")

    existing = get_session_by_reservation_id(db, reservation_id)
    if existing:
        raise ValueError("该预约已签到，不能重复签到")

    session = UsageSession(
        reservation_id=reservation_id,
        check_in_time=datetime.now(),
        session_status="IN_USE",
        operator_user_id=user_id,
    )
    db.add(session)

    reservation.reservation_status = "IN_USE"
    reservation.updated_at = datetime.now()

    db.flush()
    return session


def check_out(db: Session, reservation_id: int, user_id: int = None) -> UsageSession:
    session = get_session_by_reservation_id(db, reservation_id)
    if not session:
        raise ValueError("未找到签到记录")
    if session.session_status not in ("IN_USE", "TEMP_HOLD"):
        raise ValueError(f"当前使用状态({session.session_status})不允许签退")

    now = datetime.now()
    session.check_out_time = now
    session.session_status = "ENDED"
    session.operator_user_id = user_id
    if session.check_in_time:
        delta = now - session.check_in_time
        session.actual_minutes = int(delta.total_seconds() / 60)

    reservation = reservation_service.get_reservation_by_id(db, reservation_id)
    if reservation:
        reservation.reservation_status = "FINISHED"
        reservation.updated_at = now

    db.flush()
    return session


def start_hold(db: Session, reservation_id: int, hold_minutes: int = 15, user_id: int = None) -> UsageSession:
    session = get_session_by_reservation_id(db, reservation_id)
    if not session:
        raise ValueError("未找到签到记录")
    if session.session_status != "IN_USE":
        raise ValueError("只有使用中的状态才能暂离")

    reservation = reservation_service.get_reservation_by_id(db, reservation_id)
    if reservation:
        policy = db.query(PricingPolicy).filter(
            PricingPolicy.policy_id == reservation.policy_id
        ).first()
        if policy and not policy.allow_temp_hold:
            raise ValueError("当前策略不允许暂离")
        if policy and session.hold_count >= policy.temp_hold_max_count:
            raise ValueError(f"已达到最大暂离次数({policy.temp_hold_max_count})")

    now = datetime.now()
    session.hold_start_time = now
    session.hold_expire_time = datetime.fromtimestamp(now.timestamp() + hold_minutes * 60)
    session.hold_count += 1
    session.session_status = "TEMP_HOLD"
    session.operator_user_id = user_id
    session.updated_at = now

    db.flush()
    return session


def end_hold(db: Session, reservation_id: int, user_id: int = None) -> UsageSession:
    session = get_session_by_reservation_id(db, reservation_id)
    if not session:
        raise ValueError("未找到签到记录")
    if session.session_status != "TEMP_HOLD":
        raise ValueError("当前不在暂离状态")

    session.hold_start_time = None
    session.hold_expire_time = None
    session.session_status = "IN_USE"
    session.operator_user_id = user_id
    session.updated_at = datetime.now()

    db.flush()
    return session
