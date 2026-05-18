from typing import Optional
from pydantic import BaseModel


class UserAccountOut(BaseModel):
    userId: int
    balance: float
    arrearsAmount: float
    totalRecharge: float
    totalSpend: float
    createdAt: str
    updatedAt: str

    class Config:
        from_attributes = True


class TransactionOut(BaseModel):
    txnId: int
    txnNo: str
    userId: int
    txnCategory: str
    txnType: str
    direction: str
    amount: Optional[float] = None
    beforeBalance: Optional[float] = None
    afterBalance: Optional[float] = None
    creditDelta: Optional[int] = None
    beforeScore: Optional[int] = None
    afterScore: Optional[int] = None
    operatorUserId: Optional[int] = None
    remark: Optional[str] = None
    createdAt: str

    class Config:
        from_attributes = True


class RechargeRequest(BaseModel):
    amount: float
