from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import Result, success
from app.schemas.billing import BillingOrderOut
from app.services import billing_service

router = APIRouter()


@router.get("/billing/{bill_id}", response_model=Result[BillingOrderOut])
def get_bill(bill_id: int, db: Session = Depends(get_db)):
    bill = billing_service.get_bill_by_id(db, bill_id)
    if not bill:
        raise HTTPException(status_code=404, detail="账单不存在")
    data = BillingOrderOut(
        billId=bill.bill_id,
        billNo=bill.bill_no,
        reservationId=bill.reservation_id,
        userId=bill.user_id,
        baseAmount=float(bill.base_amount),
        overtimeAmount=float(bill.overtime_amount),
        discountAmount=float(bill.discount_amount),
        payableAmount=float(bill.payable_amount),
        paidAmount=float(bill.paid_amount),
        billStatus=bill.bill_status,
        settledAt=str(bill.settled_at) if bill.settled_at else None,
        createdAt=str(bill.created_at),
        updatedAt=str(bill.updated_at),
    )
    return success(data)
