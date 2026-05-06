from typing import Optional
from pydantic import BaseModel


class CreditTransactionOut(BaseModel):
    creditTxnId: int
    userId: int
    reservationId: Optional[int] = None
    sessionId: Optional[int] = None
    eventType: str
    changeScore: int
    beforeScore: int
    afterScore: int
    operatorUserId: Optional[int] = None
    reasonText: Optional[str] = None
    createdAt: str

    class Config:
        from_attributes = True


class CreditAdjustRequest(BaseModel):
    changeScore: int
    reason: Optional[str] = None
    operatorUserId: Optional[int] = None
