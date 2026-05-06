from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import success
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    data = report_service.get_dashboard(db)
    return success(data)


@router.get("/top-spaces")
def top_spaces(limit: int = 5, db: Session = Depends(get_db)):
    data = report_service.get_top_spaces(db, limit)
    return success(data)


@router.get("/credit-events")
def credit_events(db: Session = Depends(get_db)):
    data = report_service.get_credit_events(db)
    return success(data)
