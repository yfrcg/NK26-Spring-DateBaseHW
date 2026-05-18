from datetime import date, datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import success
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    data = report_service.get_dashboard_data(db)
    return success(data)


@router.get("/top-spaces")
def top_spaces(limit: int = 5, db: Session = Depends(get_db)):
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    data = report_service.get_top_spaces(db, today_start, today_end, limit)
    return success(data)


@router.get("/credit-events")
def credit_events(db: Session = Depends(get_db)):
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    data = report_service.get_credit_event_stats(db, today_start, today_end)
    return success(data)
