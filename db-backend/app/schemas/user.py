from typing import Optional
from pydantic import BaseModel


class UserOut(BaseModel):
    userId: int
    userNo: str
    realName: str
    phone: Optional[str] = None
    email: Optional[str] = None
    userType: str
    accountStatus: str
    balance: float
    arrearsAmount: float
    totalRecharge: float
    totalSpend: float
    creditScore: int
    lastLoginTime: Optional[str] = None
    createdAt: str
    updatedAt: str
    isDeleted: int = 0
    deletedAt: Optional[str] = None
    deletedBy: Optional[int] = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    userNo: str
    password: str


class RegisterRequest(BaseModel):
    userNo: str
    realName: str
    phone: Optional[str] = None
    email: Optional[str] = None
    password: str
    userType: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str


class AuthResponse(BaseModel):
    token: str
    user: UserOut


class UserCreateRequest(RegisterRequest):
    pass
