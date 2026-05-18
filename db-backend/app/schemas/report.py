from pydantic import BaseModel


class DashboardVO(BaseModel):
    todayReservationCount: int
    todayCheckInCount: int
    todayRevenue: float
    unpaidBillCount: int
    activeUserCount: int


class TopSpaceVO(BaseModel):
    spaceId: int
    spaceName: str
    reservationCount: int


class CreditEventStatVO(BaseModel):
    eventType: str
    eventCount: int
