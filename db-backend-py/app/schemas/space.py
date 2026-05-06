from typing import Optional
from pydantic import BaseModel


class SpaceOut(BaseModel):
    spaceId: int
    locationId: int
    policyId: int
    spaceCode: str
    spaceName: str
    spaceType: str
    capacity: int
    equipmentDesc: Optional[str] = None
    status: str
    sortNo: int
    createdAt: str
    updatedAt: str
    isDeleted: int = 0

    class Config:
        from_attributes = True


class PricingPolicyOut(BaseModel):
    policyId: int
    policyCode: str
    policyName: str
    chargeMode: str
    hourlyPrice: float
    freeMinutes: int
    maxReserveHours: int
    depositAmount: float
    overtimePriceMultiplier: float
    allowTempHold: int
    tempHoldLimitMinutes: int
    tempHoldMaxCount: int
    isActive: int
    validFrom: str
    validTo: Optional[str] = None
    remarks: Optional[str] = None
    createdAt: str
    updatedAt: str
    isDeleted: int = 0

    class Config:
        from_attributes = True
