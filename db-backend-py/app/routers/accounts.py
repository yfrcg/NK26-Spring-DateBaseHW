from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas.common import success, fail
from app.schemas.account import RechargeRequest
from app.services import account_service

router = APIRouter(prefix="/accounts", tags=["accounts"])


def _account_to_dict(account):
    return {
        "userId": account.user_id,
        "balance": float(account.balance),
        "frozenAmount": float(account.frozen_amount),
        "arrearsAmount": float(account.arrears_amount),
        "totalRecharge": float(account.total_recharge),
        "totalSpend": float(account.total_spend),
        "versionNo": account.version_no,
        "lastSettlementTime": account.last_settlement_time.isoformat() if account.last_settlement_time else None,
        "createdAt": account.created_at.isoformat() if account.created_at else None,
        "updatedAt": account.updated_at.isoformat() if account.updated_at else None,
    }


def _txn_to_dict(txn):
    return {
        "txnId": txn.txn_id,
        "txnNo": txn.txn_no,
        "accountUserId": txn.account_user_id,
        "reservationId": txn.reservation_id,
        "billId": txn.bill_id,
        "txnType": txn.txn_type,
        "direction": txn.direction,
        "amount": float(txn.amount),
        "beforeBalance": float(txn.before_balance),
        "afterBalance": float(txn.after_balance),
        "operatorUserId": txn.operator_user_id,
        "remark": txn.remark,
        "createdAt": txn.created_at.isoformat() if txn.created_at else None,
    }


@router.get("/{user_id}")
def get_account(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_type != "ADMIN" and current_user.user_id != user_id:
        return fail(403, "无权访问")
    account = account_service.get_account(db, user_id)
    if not account:
        return fail(404, "账户不存在")
    return success(_account_to_dict(account))


@router.post("/{user_id}/recharge")
def recharge(user_id: int, body: RechargeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_type != "ADMIN" and current_user.user_id != user_id:
        return fail(403, "无权访问")
    try:
        account = account_service.recharge(db, user_id, body.amount, current_user.user_id)
        db.commit()
        return success(_account_to_dict(account))
    except ValueError as e:
        return fail(400, str(e))


@router.get("/{user_id}/transactions")
def list_transactions(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_type != "ADMIN" and current_user.user_id != user_id:
        return fail(403, "无权访问")
    txns = account_service.get_transactions(db, user_id)
    return success([_txn_to_dict(t) for t in txns])
