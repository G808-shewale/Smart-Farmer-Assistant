# ==============================================================================
# Smart Farmer Assistant - Database Configuration
# Engine: SQLite with SQLAlchemy ORM
# ==============================================================================

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Database file location in the backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(BASE_DIR, "smart_farmer.db")

# Vercel Serverless environment support (writable ephemeral storage in /tmp)
if os.environ.get("VERCEL"):
    import shutil
    TMP_DB = "/tmp/smart_farmer.db"
    if not os.path.exists(TMP_DB) and os.path.exists(DATABASE_FILE):
        try:
            shutil.copy2(DATABASE_FILE, TMP_DB)
        except Exception:
            pass
    if os.path.exists(TMP_DB):
        DATABASE_FILE = TMP_DB

# Support PostgreSQL or cloud database via DATABASE_URL if configured, otherwise SQLite
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DATABASE_FILE}"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

# SessionLocal class will be an instance of a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy ORM models
Base = declarative_base()

# FastAPI Dependency to get database session per request and cleanly close it
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
