from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import Result, success, fail
from app.schemas.account import UserAccountOut, TransactionOut, RechargeRequest
from app.services import account_service

router = APIRouter()


@router.get("/users/{user_id}/account", response_model=Result[UserAccountOut])
def get_account(user_id: int, db: Session = Depends(get_db)):
    user = account_service.get_account_info(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    data = UserAccountOut(
        userId=user.user_id,
        balance=float(user.balance),
        arrearsAmount=float(user.arrears_amount),
        totalRecharge=float(user.total_recharge),
        totalSpend=float(user.total_spend),
        createdAt=str(user.created_at),
        updatedAt=str(user.updated_at),
    )
    return success(data)


@router.get("/users/{user_id}/account/transactions", response_model=Result[list[TransactionOut]])
def get_transactions(user_id: int, category: str = None, db: Session = Depends(get_db)):
    txns = account_service.get_transactions(db, user_id, category)
    items = [
        TransactionOut(
            txnId=t.txn_id,
            txnNo=t.txn_no,
            userId=t.user_id,
            txnCategory=t.txn_category,
            txnType=t.txn_type,
            direction=t.direction,
            amount=float(t.amount) if t.amount else None,
            beforeBalance=float(t.before_balance) if t.before_balance else None,
            afterBalance=float(t.after_balance) if t.after_balance else None,
            creditDelta=t.credit_delta,
            beforeScore=t.before_score,
            afterScore=t.after_score,
            operatorUserId=t.operator_user_id,
            remark=t.remark,
            createdAt=str(t.created_at),
        )
        for t in txns
    ]
    return success(items)


@router.post("/users/{user_id}/account/recharge", response_model=Result[UserAccountOut])
def recharge(user_id: int, req: RechargeRequest, db: Session = Depends(get_db)):
    try:
        user = account_service.recharge(db, user_id, req.amount)
        data = UserAccountOut(
            userId=user.user_id,
            balance=float(user.balance),
            arrearsAmount=float(user.arrears_amount),
            totalRecharge=float(user.total_recharge),
            totalSpend=float(user.total_spend),
            createdAt=str(user.created_at),
            updatedAt=str(user.updated_at),
        )
        return success(data)
    except ValueError as e:
        return fail(str(e))
