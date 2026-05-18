from typing import Optional
from pydantic import BaseModel


class CreditTransactionOut(BaseModel):
    txnId: int
    txnNo: str
    userId: int
    txnCategory: str
    txnType: str
    direction: str
    creditDelta: Optional[int] = None
    beforeScore: Optional[int] = None
    afterScore: Optional[int] = None
    operatorUserId: Optional[int] = None
    remark: Optional[str] = None
    createdAt: str

    class Config:
        from_attributes = True


class CreditAdjustRequest(BaseModel):
    changeScore: int
    reason: Optional[str] = None
    operatorUserId: Optional[int] = None
