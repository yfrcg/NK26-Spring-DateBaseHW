from datetime import datetime
from decimal import Decimal
from typing import Any

from sqlalchemy.orm import Session

from app.models.pricing import PricingPolicy


def list_policies(db: Session) -> list[PricingPolicy]:
    return (
        db.query(PricingPolicy)
        .filter(PricingPolicy.is_deleted == 0)
        .order_by(PricingPolicy.policy_id.desc())
        .all()
    )


def _decimal(value: Any) -> Decimal:
    return Decimal(str(value))


def _normalize_policy_data(data: dict[str, Any]) -> dict[str, Any]:
    fields = {
        "policyName": "policy_name",
        "chargeMode": "charge_mode",
        "hourlyPrice": "hourly_price",
        "freeMinutes": "free_minutes",
        "maxReserveHours": "max_reserve_hours",
        "overtimePriceMultiplier": "overtime_price_multiplier",
        "allowTempHold": "allow_temp_hold",
        "tempHoldLimitMinutes": "temp_hold_limit_minutes",
        "tempHoldMaxCount": "temp_hold_max_count",
        "isActive": "is_active",
        "validFrom": "valid_from",
        "validTo": "valid_to",
        "remarks": "remarks",
    }
    normalized = {
        column: data[key]
        for key, column in fields.items()
        if key in data and data[key] is not None
    }

    for key in ("hourly_price", "overtime_price_multiplier"):
        if key in normalized:
            normalized[key] = _decimal(normalized[key])

    if "allow_temp_hold" in normalized:
        normalized["allow_temp_hold"] = 1 if normalized["allow_temp_hold"] else 0

    if normalized.get("charge_mode") == "FREE":
        normalized["hourly_price"] = Decimal("0.00")

    if normalized.get("allow_temp_hold") == 0:
        normalized["temp_hold_limit_minutes"] = 0
        normalized["temp_hold_max_count"] = 0

    return normalized


def _validate_policy_values(data: dict[str, Any]) -> None:
    if data.get("charge_mode") not in (None, "FREE", "PAID"):
        raise ValueError("计费模式只能是 FREE 或 PAID")
    if data.get("hourly_price", Decimal("0")) < 0:
        raise ValueError("小时单价不能为负数")
    if data.get("free_minutes", 0) < 0:
        raise ValueError("免费分钟数不能为负数")
    if data.get("max_reserve_hours", 1) <= 0:
        raise ValueError("最大预约时长必须大于 0")
    if data.get("overtime_price_multiplier", Decimal("1")) < Decimal("1.00"):
        raise ValueError("超时倍率不能小于 1")
    if data.get("valid_to") and data.get("valid_from") and data["valid_to"] <= data["valid_from"]:
        raise ValueError("失效时间必须晚于生效时间")
    if data.get("allow_temp_hold") == 1 and (
        data.get("temp_hold_limit_minutes", 0) <= 0
        or data.get("temp_hold_max_count", 0) <= 0
    ):
        raise ValueError("允许暂离时必须设置暂离时长和次数")


def _get_active_policy(db: Session, policy_id: int) -> PricingPolicy:
    policy = (
        db.query(PricingPolicy)
        .filter(PricingPolicy.policy_id == policy_id, PricingPolicy.is_deleted == 0)
        .first()
    )
    if not policy:
        raise ValueError("策略不存在")
    return policy


def create_policy(db: Session, data: dict[str, Any]) -> PricingPolicy:
    policy_code = data.get("policyCode")
    if not policy_code:
        raise ValueError("策略编码不能为空")
    if db.query(PricingPolicy).filter(PricingPolicy.policy_code == policy_code).first():
        raise ValueError("策略编码已存在")

    normalized = _normalize_policy_data(data)
    normalized["policy_code"] = policy_code
    if "policy_name" not in normalized:
        raise ValueError("策略名称不能为空")
    if "charge_mode" not in normalized:
        raise ValueError("计费模式不能为空")

    normalized.setdefault("hourly_price", Decimal("0.00"))
    normalized.setdefault("free_minutes", 0)
    normalized.setdefault("max_reserve_hours", 4)
    normalized.setdefault("overtime_price_multiplier", Decimal("1.50"))
    normalized.setdefault("allow_temp_hold", 0)
    normalized.setdefault("temp_hold_limit_minutes", 0)
    normalized.setdefault("temp_hold_max_count", 0)
    normalized.setdefault("is_active", 1)

    if normalized["charge_mode"] == "FREE":
        normalized["hourly_price"] = Decimal("0.00")
    if normalized["allow_temp_hold"] == 0:
        normalized["temp_hold_limit_minutes"] = 0
        normalized["temp_hold_max_count"] = 0

    _validate_policy_values(normalized)
    policy = PricingPolicy(**normalized)
    db.add(policy)
    db.flush()
    return policy


def update_policy(db: Session, policy_id: int, data: dict[str, Any]) -> PricingPolicy:
    policy = _get_active_policy(db, policy_id)
    normalized = _normalize_policy_data(data)
    snapshot = {
        "charge_mode": policy.charge_mode,
        "hourly_price": policy.hourly_price,
        "free_minutes": policy.free_minutes,
        "max_reserve_hours": policy.max_reserve_hours,
        "overtime_price_multiplier": policy.overtime_price_multiplier,
        "allow_temp_hold": policy.allow_temp_hold,
        "temp_hold_limit_minutes": policy.temp_hold_limit_minutes,
        "temp_hold_max_count": policy.temp_hold_max_count,
        "valid_from": policy.valid_from,
        "valid_to": policy.valid_to,
    }
    snapshot.update(normalized)
    _validate_policy_values(snapshot)

    for key, value in normalized.items():
        setattr(policy, key, value)
    return policy


def delete_policy(db: Session, policy_id: int, operator_user_id: int | None = None) -> PricingPolicy:
    policy = _get_active_policy(db, policy_id)
    policy.is_deleted = 1
    policy.is_active = 0
    policy.deleted_at = datetime.now()
    policy.deleted_by = operator_user_id
    return policy


def update_policy_active(db: Session, policy_id: int, is_active: int) -> PricingPolicy:
    policy = _get_active_policy(db, policy_id)
    policy.is_active = is_active
    return policy
