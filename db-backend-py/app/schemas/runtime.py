from typing import Optional
from pydantic import BaseModel


class SpaceRuntimeStatusOut(BaseModel):
    spaceId: int
    currentStatus: str
    currentReservationId: Optional[int] = None
    currentSessionId: Optional[int] = None
    statusSince: Optional[str] = None
    holdExpireTime: Optional[str] = None
    createdAt: str
    updatedAt: str

    class Config:
        from_attributes = True
