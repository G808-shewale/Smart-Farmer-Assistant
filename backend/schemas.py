# ==============================================================================
# Smart Farmer Assistant - Pydantic Validation Schemas
# Defines data validation and response models for FastAPI
# ==============================================================================

from datetime import datetime
from typing import Optional, Literal, List
from pydantic import BaseModel, Field, ConfigDict

# ==============================================================================
# FARM TRANSACTION SCHEMAS
# ==============================================================================

class TransactionBase(BaseModel):
    type: Literal["income", "expense"] = Field(
        ...,
        description="Must be either 'income' (sale/subsidy) or 'expense' (cost)"
    )
    category_key: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Category code, e.g. catSeeds, catFertilizer, catCropSale"
    )
    category_name: Optional[str] = Field(
        None,
        description="Optional human-readable category name"
    )
    amount: float = Field(
        ...,
        gt=0,
        description="Transaction amount in Rupees (must be positive)"
    )
    transaction_date: str = Field(
        ...,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Date format YYYY-MM-DD"
    )
    description: Optional[str] = Field(
        None,
        max_length=255,
        description="Notes, crop details or vendor name"
    )
    farmer_id: Optional[int] = Field(
        None,
        description="Optional farmer profile ID this transaction belongs to"
    )


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TransactionSummaryResponse(BaseModel):
    total_income: float = Field(..., description="Total income in Rupees")
    total_expense: float = Field(..., description="Total expenses in Rupees")
    net_profit: float = Field(..., description="Net Profit = Income - Expenses")
    total_records: int = Field(..., description="Total count of transactions")
    income_count: int = Field(..., description="Number of income transactions")
    expense_count: int = Field(..., description="Number of expense transactions")


# ==============================================================================
# FARMER PROFILE SCHEMAS
# ==============================================================================

class FarmerProfileBase(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Farmer's full name"
    )
    phone_number: Optional[str] = Field(
        None,
        max_length=15,
        description="Contact phone number (Sample/Demo format, e.g. 9876543210)"
    )
    district: str = Field(
        "Pune",
        min_length=2,
        max_length=50,
        description="District / Taluka"
    )
    state: str = Field(
        "Maharashtra",
        min_length=2,
        max_length=50,
        description="State in India"
    )
    preferred_language: Literal["mr", "hi", "en"] = Field(
        "mr",
        description="Preferred language ('mr' for Marathi, 'hi' for Hindi, 'en' for English)"
    )
    total_acres: float = Field(
        1.0,
        gt=0,
        description="Total cultivated farmland in acres"
    )
    primary_crop: Optional[str] = Field(
        "Soybean",
        description="Primary crop grown, e.g., Soybean, Cotton, Onion, Wheat"
    )


class FarmerRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="Farmer's full name")
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_\-\.]+$", description="Unique username")
    password: str = Field(..., min_length=6, max_length=100, description="Account password (minimum 6 characters)")
    phone_number: Optional[str] = Field(None, pattern=r"^[0-9]{10}$", description="10-digit mobile number")
    district: str = Field("Pune", min_length=2, max_length=50)
    state: str = Field("Maharashtra", min_length=2, max_length=50)
    preferred_language: Literal["mr", "hi", "en"] = "mr"
    total_acres: float = Field(1.0, gt=0)
    primary_crop: Optional[str] = Field("Soybean", max_length=50)


class FarmerLoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username or 10-digit registered mobile number")
    password: str = Field(..., min_length=1, max_length=100, description="Account password")


class FarmerProfileCreate(FarmerProfileBase):
    pass


class FarmerProfileResponse(FarmerProfileBase):
    id: int
    username: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    transactions_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_hours: int = 24
    farmer: FarmerProfileResponse

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# SMART IRRIGATION LOG SCHEMAS
# ==============================================================================

class IrrigationLogBase(BaseModel):
    crop_name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Name of the crop irrigated, e.g. Soybean, Cotton, Wheat, Onion"
    )
    irrigation_date: str = Field(
        ...,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Date in format YYYY-MM-DD"
    )
    duration_hours: float = Field(
        ...,
        gt=0,
        le=24,
        description="Irrigation runtime in hours (must be greater than 0 and at most 24)"
    )
    water_quantity_liters: Optional[float] = Field(
        None,
        ge=0,
        description="Optional measured or estimated water quantity in Liters"
    )
    irrigation_method: Optional[str] = Field(
        None,
        max_length=30,
        description="Method used: methodDrip, methodSprinkler, methodFlood"
    )
    notes: Optional[str] = Field(
        None,
        max_length=255,
        description="Optional notes regarding motor/valves, plot area, or fertilizers mixed"
    )
    farmer_id: Optional[int] = Field(
        None,
        description="Optional ID of the farmer profile this log belongs to"
    )


class IrrigationLogCreate(IrrigationLogBase):
    pass


class IrrigationLogUpdate(BaseModel):
    crop_name: Optional[str] = Field(None, min_length=2, max_length=50)
    irrigation_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    duration_hours: Optional[float] = Field(None, gt=0, le=24)
    water_quantity_liters: Optional[float] = Field(None, ge=0)
    irrigation_method: Optional[str] = Field(None, max_length=30)
    notes: Optional[str] = Field(None, max_length=255)


class IrrigationLogResponse(IrrigationLogBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# FARM TASKS & REMINDERS CALENDAR SCHEMAS (PHASE 4)
# ==============================================================================

class FarmTaskBase(BaseModel):
    title: str = Field(
        ...,
        min_length=2,
        max_length=150,
        description="Name or title of the farm activity/task"
    )
    description: Optional[str] = Field(
        None,
        max_length=255,
        description="Optional detailed instructions or field notes"
    )
    category: str = Field(
        "other",
        max_length=50,
        description="Category: sowing, irrigation, fertilizer, spraying, harvest, market, maintenance, other"
    )
    due_date: str = Field(
        ...,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Target completion date in format YYYY-MM-DD"
    )
    priority: Literal["high", "medium", "low"] = Field(
        "medium",
        description="Priority level: high, medium, or low"
    )
    status: Literal["pending", "completed"] = Field(
        "pending",
        description="Status: pending or completed"
    )
    reminder_date: Optional[str] = Field(
        None,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Optional alert/reminder date in format YYYY-MM-DD"
    )
    farmer_id: Optional[int] = Field(
        None,
        description="Optional ID of the farmer profile this task belongs to"
    )


class FarmTaskCreate(FarmTaskBase):
    pass


class FarmTaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, max_length=255)
    category: Optional[str] = Field(None, max_length=50)
    due_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    priority: Optional[Literal["high", "medium", "low"]] = None
    status: Optional[Literal["pending", "completed"]] = None
    reminder_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    is_completed: Optional[bool] = None


class FarmTaskResponse(FarmTaskBase):
    id: int
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# APMC CROP MARKET PRICES & SELLING ADVISOR SCHEMAS (PHASE 5)
# ==============================================================================

class MarketPriceBase(BaseModel):
    commodity: str = Field(..., min_length=2, max_length=80, description="Commodity name")
    commodity_code: str = Field(..., min_length=2, max_length=50, description="Standard code: onion, soybean, cotton, wheat, chana, maize")
    mandi: str = Field(..., min_length=2, max_length=80, description="APMC Mandi name")
    state: str = Field("Maharashtra", max_length=50)
    district: str = Field(..., max_length=50)
    min_price: float = Field(..., gt=0, description="Minimum price in ₹/Quintal")
    modal_price: float = Field(..., gt=0, description="Modal (most common) price in ₹/Quintal")
    max_price: float = Field(..., gt=0, description="Maximum price in ₹/Quintal")
    msp_price: Optional[float] = Field(None, gt=0, description="Official GOI Minimum Support Price in ₹/Quintal")
    msp_season: Optional[str] = Field(None, max_length=50, description="Applicable marketing season, e.g. KMS 2026-27 or RMS 2026-27")
    msp_effective_period: Optional[str] = Field(None, max_length=80, description="Official marketing period, e.g. Oct 2026 - Sep 2027")
    msp_source_url: Optional[str] = Field(None, max_length=200, description="Authoritative GOI source URL")
    msp_update_date: Optional[str] = Field(None, max_length=20, description="Official notification date")
    last_fetched_at: Optional[str] = Field(None, max_length=40, description="Timestamp of when record was fetched or refreshed")
    price_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Report date in format YYYY-MM-DD")
    source: str = Field(..., max_length=150, description="Trustworthy source (e.g. Agmarknet / MSAMB)")
    data_quality: Literal["verified_live", "dated_verified", "sample_demo", "unavailable"] = Field(
        "dated_verified",
        description="Data provenance: verified_live, dated_verified, sample_demo, or unavailable"
    )
    weekly_change_pct: Optional[float] = Field(None, description="7-day percentage change (+% or -%)")
    arrivals_tonnes: Optional[float] = Field(None, ge=0, description="Market arrival volume in metric tonnes")


class MarketPriceCreate(MarketPriceBase):
    pass


class MarketPriceResponse(MarketPriceBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class MarketPriceHistoryResponse(BaseModel):
    id: int
    commodity_code: str
    mandi: str
    price_date: str
    modal_price: float
    arrivals_tonnes: Optional[float] = None
    source: str

    model_config = ConfigDict(from_attributes=True)


class MarketSellingAdviceResponse(BaseModel):
    commodity: str
    commodity_code: str
    mandi: str
    current_modal_price: float
    msp_price: Optional[float] = None
    msp_season: Optional[str] = None
    msp_source_url: Optional[str] = None
    recommendation: Literal["SELL", "HOLD", "WATCH"]
    recommendation_label: str
    confidence: str
    explanation: str
    factors: List[str]
    source: str
    price_date: str
    last_fetched_at: Optional[str] = None
    data_quality: str
    disclaimer: str
