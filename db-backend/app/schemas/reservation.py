from typing import Optional
from pydantic import BaseModel


class ReservationOut(BaseModel):
    reservationId: int
    reservationNo: str
    userId: int
    spaceId: int
    policyId: int
    reservationType: str
    startTime: str
    endTime: str
    reservationStatus: str
    chargeModeSnapshot: str
    hourlyPriceSnapshot: float
    freeMinutesSnapshot: int
    maxReserveHoursSnapshot: int
    overtimeMultiplierSnapshot: float
    amountEstimated: float
    cancelReason: Optional[str] = None
    cancelTime: Optional[str] = None
    createdAt: str
    updatedAt: str

    class Config:
        from_attributes = True


class ReservationCreateRequest(BaseModel):
    userId: int
    spaceId: int
    startTime: str
    endTime: str
