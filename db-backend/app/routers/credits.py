from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import Result, success, fail
from app.schemas.credit import CreditTransactionOut, CreditAdjustRequest
from app.services import credit_service

router = APIRouter()


@router.get("/users/{user_id}/credits", response_model=Result[int])
def get_credits(user_id: int, db: Session = Depends(get_db)):
    score = credit_service.get_user_credits(db, user_id)
    return success(score)


@router.get("/users/{user_id}/credits/transactions", response_model=Result[list[CreditTransactionOut]])
def get_credit_transactions(user_id: int, db: Session = Depends(get_db)):
    txns = credit_service.get_credit_transactions(db, user_id)
    items = [
        CreditTransactionOut(
            txnId=t.txn_id,
            txnNo=t.txn_no,
            userId=t.user_id,
            txnCategory=t.txn_category,
            txnType=t.txn_type,
            direction=t.direction,
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


@router.post("/users/{user_id}/credits/adjust", response_model=Result[dict])
def adjust_credits(user_id: int, req: CreditAdjustRequest, db: Session = Depends(get_db)):
    try:
        txn_type = "MANUAL_RESTORE" if req.changeScore > 0 else "ADJUST"
        user = credit_service.update_credit_score(
            db, user_id, req.changeScore, txn_type, req.operatorUserId, req.reason
        )
        return success({"creditScore": user.credit_score})
    except ValueError as e:
        return fail(str(e))
