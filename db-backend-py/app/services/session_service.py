import math
from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.models.session import UsageSession
from app.models.reservation import Reservation, SpaceTimeLock
from app.models.runtime import SpaceRuntimeStatus
from app.services.account_service import create_bill_and_try_pay
from app.services.credit_service import adjust_credit


def get_session_by_reservation(db: Session, reservation_id: int) -> Optional[UsageSession]:
    return db.query(UsageSession).filter(UsageSession.reservation_id == reservation_id).first()


def check_in(db: Session, reservation_id: int, operator_user_id: int = None) -> UsageSession:
    reservation = db.query(Reservation).filter(Reservation.reservation_id == reservation_id).first()
    if not reservation:
        raise ValueError("预约不存在")
    if reservation.reservation_status != "CONFIRMED":
        raise ValueError("只有已确认的预约才能签到")

    now = datetime.now()
    if now < reservation.start_time:
        raise ValueError("还未到预约开始时间")

    session = UsageSession(
        reservation_id=reservation_id,
        check_in_time=now,
        session_status="IN_USE",
        operator_user_id=operator_user_id,
    )
    db.add(session)
    db.flush()

    reservation.reservation_status = "IN_USE"
    reservation.updated_at = now

    _update_runtime_status(db, reservation.space_id, "IN_USE", reservation_id, session.session_id, now)

    return session


def temp_hold(db: Session, reservation_id: int) -> UsageSession:
    session = get_session_by_reservation(db, reservation_id)
    if not session:
        raise ValueError("使用记录不存在")
    if session.session_status != "IN_USE":
        raise ValueError("当前状态不允许临时占座")

    reservation = db.query(Reservation).filter(Reservation.reservation_id == reservation_id).first()
    from app.models.pricing import PricingPolicy
    policy = db.query(PricingPolicy).filter(PricingPolicy.policy_id == reservation.policy_id).first()
    if not policy or not policy.allow_temp_hold:
        raise ValueError("该策略不允许临时占座")
    if session.hold_count >= policy.temp_hold_max_count:
        raise ValueError("已达临时占座次数上限")

    now = datetime.now()
    from datetime import timedelta
    expire_time = now + timedelta(minutes=policy.temp_hold_limit_minutes)

    session.session_status = "TEMP_HOLD"
    session.hold_start_time = now
    session.hold_expire_time = expire_time
    session.hold_count += 1
    session.updated_at = now

    _update_runtime_status(db, reservation.space_id, "TEMP_HOLD", reservation_id, session.session_id, now)
    runtime = db.query(SpaceRuntimeStatus).filter(SpaceRuntimeStatus.space_id == reservation.space_id).first()
    if runtime:
        runtime.hold_expire_time = expire_time

    return session


def resume(db: Session, reservation_id: int) -> UsageSession:
    session = get_session_by_reservation(db, reservation_id)
    if not session:
        raise ValueError("使用记录不存在")
    if session.session_status != "TEMP_HOLD":
        raise ValueError("当前状态不允许恢复使用")

    now = datetime.now()

    if session.hold_expire_time and now > session.hold_expire_time:
        hold_minutes = int((session.hold_expire_time - session.hold_start_time).total_seconds() / 60)
        session.total_hold_minutes += hold_minutes
        session.session_status = "ABNORMAL"
        session.updated_at = now

        reservation = db.query(Reservation).filter(Reservation.reservation_id == reservation_id).first()
        _update_runtime_status(db, reservation.space_id, "IDLE", None, None, now)

        user_id = reservation.user_id
        adjust_credit(db, user_id, -10, "HOLD_TIMEOUT", reservation_id=reservation_id, session_id=session.session_id)
        reservation.reservation_status = "FINISHED"
        reservation.updated_at = now

        raise ValueError("临时占座已超时，使用已结束")

    if session.hold_start_time:
        hold_minutes = int((now - session.hold_start_time).total_seconds() / 60)
        session.total_hold_minutes += hold_minutes

    session.session_status = "IN_USE"
    session.hold_start_time = None
    session.hold_expire_time = None
    session.updated_at = now

    reservation = db.query(Reservation).filter(Reservation.reservation_id == reservation_id).first()
    _update_runtime_status(db, reservation.space_id, "IN_USE", reservation_id, session.session_id, now)

    return session


def check_out(db: Session, reservation_id: int, operator_user_id: int = None) -> UsageSession:
    session = get_session_by_reservation(db, reservation_id)
    if not session:
        raise ValueError("使用记录不存在")
    if session.session_status not in ("IN_USE", "TEMP_HOLD"):
        raise ValueError("当前状态不允许签退")

    now = datetime.now()
    reservation = db.query(Reservation).filter(Reservation.reservation_id == reservation_id).first()

    if session.session_status == "TEMP_HOLD" and session.hold_start_time:
        hold_minutes = int((now - session.hold_start_time).total_seconds() / 60)
        session.total_hold_minutes += hold_minutes

    check_in_time = session.check_in_time or now
    total_minutes = int((now - check_in_time).total_seconds() / 60)
    total_minutes = max(total_minutes - session.total_hold_minutes, 0)

    reserved_minutes = int((reservation.end_time - reservation.start_time).total_seconds() / 60)
    overtime_minutes = max(total_minutes - reserved_minutes, 0)

    session.check_out_time = now
    session.actual_minutes = total_minutes
    session.overtime_minutes = overtime_minutes
    session.session_status = "ENDED"
    session.operator_user_id = operator_user_id or session.operator_user_id
    session.updated_at = now

    reservation.reservation_status = "FINISHED"
    reservation.updated_at = now

    _update_runtime_status(db, reservation.space_id, "IDLE", None, None, now)

    locks = (
        db.query(SpaceTimeLock)
        .filter(SpaceTimeLock.reservation_id == reservation_id, SpaceTimeLock.lock_status == "ACTIVE")
        .all()
    )
    for lock in locks:
        lock.lock_status = "RELEASED"
        lock.updated_at = now

    base_amount = 0.0
    overtime_amount = 0.0
    if reservation.charge_mode_snapshot == "PAID":
        free_min = reservation.free_minutes_snapshot
        billable_minutes = max(total_minutes - free_min, 0)
        hourly = float(reservation.hourly_price_snapshot)
        base_amount = (billable_minutes / 60) * hourly

        if overtime_minutes > 0:
            multiplier = float(reservation.overtime_multiplier_snapshot)
            overtime_amount = (overtime_minutes / 60) * hourly * multiplier

    create_bill_and_try_pay(
        db,
        reservation_id=reservation_id,
        user_id=reservation.user_id,
        base_amount=round(base_amount, 2),
        overtime_amount=round(overtime_amount, 2),
    )

    if overtime_minutes > 0:
        penalty = min(int(overtime_minutes / 10), 20)
        if penalty > 0:
            adjust_credit(
                db, reservation.user_id, -penalty, "OVERTIME",
                reservation_id=reservation_id, session_id=session.session_id,
            )

    return session


def mark_hold_timeout(db: Session, reservation_id: int) -> UsageSession:
    session = get_session_by_reservation(db, reservation_id)
    if not session or session.session_status != "TEMP_HOLD":
        return session

    now = datetime.now()
    reservation = db.query(Reservation).filter(Reservation.reservation_id == reservation_id).first()

    if session.hold_start_time:
        hold_minutes = int((now - session.hold_start_time).total_seconds() / 60)
        session.total_hold_minutes += hold_minutes

    session.session_status = "ABNORMAL"
    session.updated_at = now

    reservation.reservation_status = "FINISHED"
    reservation.updated_at = now

    _update_runtime_status(db, reservation.space_id, "IDLE", None, None, now)

    adjust_credit(db, reservation.user_id, -10, "HOLD_TIMEOUT",
                  reservation_id=reservation_id, session_id=session.session_id)

    return session


def _update_runtime_status(db: Session, space_id: int, status: str,
                           reservation_id: Optional[int], session_id: Optional[int], now: datetime):
    runtime = db.query(SpaceRuntimeStatus).filter(SpaceRuntimeStatus.space_id == space_id).first()
    if not runtime:
        runtime = SpaceRuntimeStatus(space_id=space_id)
        db.add(runtime)

    runtime.current_status = status
    runtime.current_reservation_id = reservation_id
    runtime.current_session_id = session_id
    runtime.status_since = now
    runtime.updated_at = now
    if status != "TEMP_HOLD":
        runtime.hold_expire_time = None
