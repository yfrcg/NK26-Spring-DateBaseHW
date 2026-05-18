from datetime import datetime
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


class PricingPolicyCreateRequest(BaseModel):
    policyCode: str
    policyName: str
    chargeMode: str
    hourlyPrice: float = 0
    freeMinutes: int = 0
    maxReserveHours: int = 4
    overtimePriceMultiplier: float = 1.5
    allowTempHold: bool | int = False
    tempHoldLimitMinutes: int = 0
    tempHoldMaxCount: int = 0
    isActive: int = 1
    validFrom: Optional[datetime] = None
    validTo: Optional[datetime] = None
    remarks: Optional[str] = None


class PricingPolicyUpdateRequest(BaseModel):
    policyName: Optional[str] = None
    chargeMode: Optional[str] = None
    hourlyPrice: Optional[float] = None
    freeMinutes: Optional[int] = None
    maxReserveHours: Optional[int] = None
    overtimePriceMultiplier: Optional[float] = None
    allowTempHold: Optional[bool | int] = None
    tempHoldLimitMinutes: Optional[int] = None
    tempHoldMaxCount: Optional[int] = None
    isActive: Optional[int] = None
    validFrom: Optional[datetime] = None
    validTo: Optional[datetime] = None
    remarks: Optional[str] = None
