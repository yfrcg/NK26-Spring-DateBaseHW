from typing import TypeVar, Generic, Optional
from pydantic import BaseModel

T = TypeVar("T")


class Result(BaseModel, Generic[T]):
    code: int = 200
    message: str = "success"
    data: Optional[T] = None


def success(data=None, message: str = "success"):
    return Result(code=200, message=message, data=data)


def fail(code: int = 400, message: str = "请求失败"):
    return Result(code=code, message=message, data=None)
