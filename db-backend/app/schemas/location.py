from typing import Optional, List
from pydantic import BaseModel


class LocationOut(BaseModel):
    locationId: int
    parentLocationId: Optional[int] = None
    locationCode: str
    locationName: str
    locationType: str
    floorNo: Optional[str] = None
    roomNo: Optional[str] = None
    openTime: str
    closeTime: str
    status: str
    remarks: Optional[str] = None
    createdAt: str
    updatedAt: str
    isDeleted: int = 0
    deletedAt: Optional[str] = None
    deletedBy: Optional[int] = None

    class Config:
        from_attributes = True


class LocationTreeVO(BaseModel):
    locationId: int
    parentLocationId: Optional[int] = None
    locationCode: str
    locationName: str
    locationType: str
    floorNo: Optional[str] = None
    roomNo: Optional[str] = None
    status: str
    children: List["LocationTreeVO"] = []

    class Config:
        from_attributes = True


class LocationCreateRequest(BaseModel):
    parentLocationId: Optional[int] = None
    locationCode: str
    locationName: str
    locationType: str
    floorNo: Optional[str] = None
    roomNo: Optional[str] = None
    openTime: str
    closeTime: str
    remarks: Optional[str] = None
