# ==============================================================================
# Smart Farmer Assistant - Database Models
# Defines tables for Farmer Profiles and Farm Transactions
# ==============================================================================

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class FarmerProfile(Base):
    """
    Stores individual farmer profile information.
    Note: In this initial prototype, only basic operational data is collected.
    No real Aadhaar or sensitive identity documents are stored.
    """
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(15), nullable=True)  # 10-digit mobile number
    username = Column(String(50), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)  # Secure Argon2id password hash
    is_active = Column(Boolean, default=True, nullable=False)
    district = Column(String(50), default="Pune", nullable=False)
    state = Column(String(50), default="Maharashtra", nullable=False)
    preferred_language = Column(String(10), default="mr", nullable=False)  # 'mr', 'hi', or 'en'
    total_acres = Column(Float, default=1.0, nullable=False)
    primary_crop = Column(String(50), default="Soybean", nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    # Relationship to transactions
    transactions = relationship(
        "FarmTransaction",
        back_populates="farmer",
        cascade="all, delete-orphan"
    )

    # Relationship to irrigation logs
    irrigation_logs = relationship(
        "IrrigationLog",
        back_populates="farmer",
        cascade="all, delete-orphan"
    )

    # Relationship to farm tasks
    tasks = relationship(
        "FarmTask",
        back_populates="farmer",
        cascade="all, delete-orphan"
    )

    # Relationship to active authentication sessions
    sessions = relationship(
        "FarmerSession",
        back_populates="farmer",
        cascade="all, delete-orphan"
    )


class FarmerSession(Base):
    """
    Stores server-side active sessions and authentication tokens.
    Enables instant revocation on logout and session expiration checks.
    """
    __tablename__ = "farmer_sessions"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"), nullable=False, index=True)
    session_token = Column(String(128), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False, nullable=False)
    user_agent = Column(String(200), nullable=True)
    ip_address = Column(String(50), nullable=True)

    farmer = relationship("FarmerProfile", back_populates="sessions")


class FarmTransaction(Base):
    """
    Stores expense and income records for individual farmers.
    Matches frontend categories (seeds, fertilizer, labor, fuel, crop sales, subsidies).
    """
    __tablename__ = "farm_transactions"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"), nullable=True)
    type = Column(String(10), nullable=False)  # 'income' or 'expense'
    category_key = Column(String(50), nullable=False)  # e.g., 'catSeeds', 'catCropSale'
    category_name = Column(String(100), nullable=True)  # Human-readable name
    amount = Column(Float, nullable=False)  # Rupee amount
    transaction_date = Column(String(10), nullable=False)  # Format: YYYY-MM-DD
    description = Column(String(255), nullable=True)  # Notes
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    # Relationship to farmer profile
    farmer = relationship("FarmerProfile", back_populates="transactions")


class IrrigationLog(Base):
    """
    Stores completed irrigation log records for individual farmers.
    Keeps historical records of crop watering duration, method, and water quantity.
    """
    __tablename__ = "irrigation_logs"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"), nullable=True)
    crop_name = Column(String(50), nullable=False)  # e.g., Soybean, Cotton, Wheat, Onion
    irrigation_date = Column(String(10), nullable=False)  # Format: YYYY-MM-DD
    duration_hours = Column(Float, nullable=False)  # Duration in hours (e.g., 2.5)
    water_quantity_liters = Column(Float, nullable=True)  # Optional volume in liters
    irrigation_method = Column(String(30), nullable=True)  # 'methodDrip', 'methodSprinkler', 'methodFlood'
    notes = Column(String(255), nullable=True)  # Field/plot notes
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    # Relationship to farmer profile
    farmer = relationship("FarmerProfile", back_populates="irrigation_logs")


class FarmTask(Base):
    """
    Stores individual farm tasks, reminders, due dates, priorities, and completion status.
    Integrated with the dashboard calendar and upcoming tasks.
    """
    __tablename__ = "farm_tasks"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"), nullable=True)
    title = Column(String(150), nullable=False)
    description = Column(String(255), nullable=True)
    category = Column(String(50), default="other", nullable=False)  # sowing, irrigation, fertilizer, spraying, harvest, market, maintenance, other
    due_date = Column(String(10), nullable=False)  # Format: YYYY-MM-DD
    priority = Column(String(20), default="medium", nullable=False)  # high, medium, low
    status = Column(String(20), default="pending", nullable=False)  # pending, completed
    reminder_date = Column(String(10), nullable=True)  # Format: YYYY-MM-DD
    is_completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    # Relationship to farmer profile
    farmer = relationship("FarmerProfile", back_populates="tasks")


class MarketPrice(Base):
    """
    Stores APMC mandi commodity prices with dated provenance and source attribution.
    Data sources: Agmarknet (Ministry of Agriculture, GOI) & MSAMB Maharashtra.
    """
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    commodity = Column(String(80), nullable=False)  # e.g., "Red Onion", "Soybean (Yellow)"
    commodity_code = Column(String(50), nullable=False, index=True)  # e.g., "onion", "soybean"
    mandi = Column(String(80), nullable=False, index=True)  # e.g., "Nashik APMC", "Latur APMC"
    state = Column(String(50), default="Maharashtra", nullable=False)
    district = Column(String(50), nullable=False)
    min_price = Column(Float, nullable=False)  # ₹ / Quintal
    modal_price = Column(Float, nullable=False)  # ₹ / Quintal
    max_price = Column(Float, nullable=False)  # ₹ / Quintal
    msp_price = Column(Float, nullable=True)  # Minimum Support Price (₹ / Quintal)
    msp_season = Column(String(50), nullable=True)  # Applicable marketing season, e.g. "KMS 2026-27"
    msp_effective_period = Column(String(80), nullable=True)  # e.g. "October 2026 - September 2027"
    msp_source_url = Column(String(200), nullable=True)  # Official URL (e.g. CACP/PIB)
    msp_update_date = Column(String(20), nullable=True)  # Official CCEA announcement date
    last_fetched_at = Column(String(40), nullable=True)  # Timestamp when record was fetched/refreshed
    price_date = Column(String(10), nullable=False)  # Format: YYYY-MM-DD
    source = Column(String(150), nullable=False)  # e.g., "Agmarknet (agmarknet.gov.in) / MSAMB"
    data_quality = Column(String(30), default="dated_verified", nullable=False)  # 'verified_live', 'dated_verified', 'sample_demo', 'unavailable'
    weekly_change_pct = Column(Float, nullable=True)  # e.g. +8.2, -3.1
    arrivals_tonnes = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())


class MarketPriceHistory(Base):
    """
    Stores historical daily APMC modal prices for trend analysis.
    Only verifiable, dated historical figures are stored (no fabricated values).
    """
    __tablename__ = "market_price_history"

    id = Column(Integer, primary_key=True, index=True)
    commodity_code = Column(String(50), nullable=False, index=True)
    mandi = Column(String(80), nullable=False, index=True)
    price_date = Column(String(10), nullable=False)  # YYYY-MM-DD
    modal_price = Column(Float, nullable=False)
    arrivals_tonnes = Column(Float, nullable=True)
    source = Column(String(150), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
