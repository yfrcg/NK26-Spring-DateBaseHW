import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.models.reservation import Reservation, SpaceTimeLock
from app.models.space import Space
from app.models.pricing import PricingPolicy
from app.models.user import User


def create_reservation(db: Session, user_id: int, space_id: int, start_time: str, end_time: str,
                       reservation_type: str = "ONLINE") -> Reservation:
    start_dt = datetime.fromisoformat(start_time.replace("Z", "+00:00").replace("+00:00", ""))
    end_dt = datetime.fromisoformat(end_time.replace("Z", "+00:00").replace("+00:00", ""))

    if end_dt <= start_dt:
        raise ValueError("结束时间必须晚于开始时间")

    user = db.query(User).filter(User.user_id == user_id, User.is_deleted == 0).first()
    if not user:
        raise ValueError("用户不存在")
    if user.account_status == "SUSPENDED":
        raise ValueError("账号已被暂停")
    if user.account_status == "ARREARS_LOCKED":
        raise ValueError("账号因欠费已锁定，请先充值")

    space = db.query(Space).filter(Space.space_id == space_id, Space.is_deleted == 0).first()
    if not space:
        raise ValueError("空间不存在")
    if space.status != "ACTIVE":
        raise ValueError("空间当前不可用")

    policy = db.query(PricingPolicy).filter(
        PricingPolicy.policy_id == space.policy_id,
        PricingPolicy.is_deleted == 0,
    ).first()
    if not policy:
        raise ValueError("计费策略不存在")

    duration_hours = (end_dt - start_dt).total_seconds() / 3600
    if duration_hours > policy.max_reserve_hours:
        raise ValueError(f"预约时长不能超过{policy.max_reserve_hours}小时")

    conflict = (
        db.query(SpaceTimeLock)
        .filter(
            SpaceTimeLock.space_id == space_id,
            SpaceTimeLock.lock_status == "ACTIVE",
            SpaceTimeLock.lock_start_time < end_dt,
            SpaceTimeLock.lock_end_time > start_dt,
        )
        .first()
    )
    if conflict:
        raise ValueError("该时间段已被预约")

    amount_estimated = 0.0
    if policy.charge_mode == "PAID":
        amount_estimated = float(policy.hourly_price) * duration_hours

    reservation = Reservation(
        reservation_no=f"RSV{uuid.uuid4().hex[:20].upper()}",
        user_id=user_id,
        space_id=space_id,
        policy_id=space.policy_id,
        reservation_type=reservation_type,
        start_time=start_dt,
        end_time=end_dt,
        reservation_status="CONFIRMED",
        charge_mode_snapshot=policy.charge_mode,
        hourly_price_snapshot=policy.hourly_price,
        free_minutes_snapshot=policy.free_minutes,
        max_reserve_hours_snapshot=policy.max_reserve_hours,
        overtime_multiplier_snapshot=policy.overtime_price_multiplier,
        amount_estimated=Decimal(str(amount_estimated)),
    )
    db.add(reservation)
    db.flush()

    lock = SpaceTimeLock(
        space_id=space_id,
        reservation_id=reservation.reservation_id,
        lock_type="RESERVATION",
        lock_start_time=start_dt,
        lock_end_time=end_dt,
        lock_status="ACTIVE",
    )
    db.add(lock)
    db.flush()

    return reservation


def list_by_user(db: Session, user_id: int) -> list[Reservation]:
    return (
        db.query(Reservation)
        .filter(Reservation.user_id == user_id)
        .order_by(Reservation.created_at.desc())
        .all()
    )


def list_all(db: Session) -> list[Reservation]:
    return db.query(Reservation).order_by(Reservation.created_at.desc()).all()


def cancel_reservation(db: Session, reservation_id: int, reason: str = None) -> Reservation:
    reservation = db.query(Reservation).filter(Reservation.reservation_id == reservation_id).first()
    if not reservation:
        raise ValueError("预约不存在")
    if reservation.reservation_status in ("CANCELLED", "FINISHED"):
        raise ValueError("预约已结束或已取消")

    reservation.reservation_status = "CANCELLED"
    reservation.cancel_reason = reason or "用户取消"
    reservation.cancel_time = datetime.now()
    reservation.updated_at = datetime.now()

    locks = (
        db.query(SpaceTimeLock)
        .filter(
            SpaceTimeLock.reservation_id == reservation_id,
            SpaceTimeLock.lock_status == "ACTIVE",
        )
        .all()
    )
    for lock in locks:
        lock.lock_status = "RELEASED"
        lock.updated_at = datetime.now()

    return reservation


def get_reservation_by_id(db: Session, reservation_id: int) -> Optional[Reservation]:
    return db.query(Reservation).filter(Reservation.reservation_id == reservation_id).first()
