from typing import Optional
from pydantic import BaseModel


class UsageSessionOut(BaseModel):
    sessionId: int
    reservationId: int
    checkInTime: Optional[str] = None
    checkOutTime: Optional[str] = None
    actualMinutes: int
    overtimeMinutes: int
    holdStartTime: Optional[str] = None
    holdExpireTime: Optional[str] = None
    holdCount: int
    sessionStatus: str
    operatorUserId: Optional[int] = None
    notes: Optional[str] = None
    createdAt: str
    updatedAt: str

    class Config:
        from_attributes = True
