from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class UserAccountOut(BaseModel):
    userId: int
    balance: float
    frozenAmount: float
    arrearsAmount: float
    totalRecharge: float
    totalSpend: float
    versionNo: int
    lastSettlementTime: Optional[str] = None
    createdAt: str
    updatedAt: str

    class Config:
        from_attributes = True


class AccountTransactionOut(BaseModel):
    txnId: int
    txnNo: str
    accountUserId: int
    reservationId: Optional[int] = None
    billId: Optional[int] = None
    txnType: str
    direction: str
    amount: float
    beforeBalance: float
    afterBalance: float
    operatorUserId: Optional[int] = None
    remark: Optional[str] = None
    createdAt: str

    class Config:
        from_attributes = True


class RechargeRequest(BaseModel):
    amount: float
