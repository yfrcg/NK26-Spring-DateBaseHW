from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import SessionLocal
from app.services.auth_service import bootstrap_admin
from app.routers import (
    auth,
    users,
    accounts,
    locations,
    spaces,
    reservations,
    sessions,
    bills,
    credits,
    reports,
    runtime,
    admin,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        bootstrap_admin(db)
    except Exception as e:
        print(f"Bootstrap admin error: {e}")
    finally:
        db.close()
    yield


app = FastAPI(
    title="共享空间预约管理系统",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(accounts.router, prefix="/api")
app.include_router(locations.router, prefix="/api")
app.include_router(spaces.router, prefix="/api")
app.include_router(reservations.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(bills.router, prefix="/api")
app.include_router(credits.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(runtime.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "共享空间预约管理系统 API"}
