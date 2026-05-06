from datetime import date
from sqlalchemy import text
from sqlalchemy.orm import Session


def get_dashboard(db: Session) -> dict:
    today = date.today().isoformat()

    row = db.execute(text("""
        SELECT
            (SELECT COUNT(*) FROM reservations WHERE DATE(created_at) = :today) AS today_reservation_count,
            (SELECT COUNT(*) FROM usage_sessions WHERE DATE(check_in_time) = :today) AS today_check_in_count,
            (SELECT COALESCE(SUM(paid_amount), 0) FROM billing_orders WHERE bill_status='PAID' AND DATE(settled_at) = :today) AS today_revenue,
            (SELECT COUNT(*) FROM billing_orders WHERE bill_status='UNPAID') AS unpaid_bill_count,
            (SELECT COUNT(*) FROM users WHERE is_deleted=0 AND account_status='ACTIVE') AS active_user_count
    """), {"today": today}).fetchone()

    return {
        "todayReservationCount": row[0],
        "todayCheckInCount": row[1],
        "todayRevenue": float(row[2]),
        "unpaidBillCount": row[3],
        "activeUserCount": row[4],
    }


def get_top_spaces(db: Session, limit: int = 5) -> list[dict]:
    rows = db.execute(text("""
        SELECT s.space_id, s.space_name, COUNT(r.reservation_id) AS reservation_count
        FROM spaces s
        LEFT JOIN reservations r ON r.space_id = s.space_id
        WHERE s.is_deleted = 0
        GROUP BY s.space_id, s.space_name
        ORDER BY reservation_count DESC
        LIMIT :limit
    """), {"limit": limit}).fetchall()

    return [
        {"spaceId": row[0], "spaceName": row[1], "reservationCount": row[2]}
        for row in rows
    ]


def get_credit_events(db: Session) -> list[dict]:
    rows = db.execute(text("""
        SELECT event_type, COUNT(*) AS event_count
        FROM credit_transactions
        GROUP BY event_type
        ORDER BY event_count DESC
    """)).fetchall()

    return [
        {"eventType": row[0], "eventCount": row[1]}
        for row in rows
    ]
