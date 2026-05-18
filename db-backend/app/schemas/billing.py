from typing import Optional
from pydantic import BaseModel


class BillingOrderOut(BaseModel):
    billId: int
    billNo: str
    reservationId: int
    userId: int
    billStatus: str
    baseAmount: float
    overtimeAmount: float
    discountAmount: float
    payableAmount: float
    paidAmount: float
    settledAt: Optional[str] = None
    remarks: Optional[str] = None
    createdAt: str
    updatedAt: str

    class Config:
        from_attributes = True
