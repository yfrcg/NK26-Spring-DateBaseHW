from sqlalchemy.orm import Session

from app.models.pricing import PricingPolicy


def list_policies(db: Session) -> list[PricingPolicy]:
    return db.query(PricingPolicy).filter(PricingPolicy.is_deleted == 0).all()


def update_policy_active(db: Session, policy_id: int, is_active: int) -> PricingPolicy:
    policy = db.query(PricingPolicy).filter(
        PricingPolicy.policy_id == policy_id,
        PricingPolicy.is_deleted == 0,
    ).first()
    if not policy:
        raise ValueError("策略不存在")
    policy.is_active = is_active
    return policy
