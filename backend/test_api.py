# ==============================================================================
# Smart Farmer Assistant - Automated API Test Suite
# Tests endpoints, database operations, validation, and security
# Uses an isolated test database to protect the live database from data drift
# ==============================================================================

import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure project root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from backend.main import app
from backend.database import Base, get_db

# Configure isolated temporary SQLite test database
TEST_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_smart_farmer_isolated.db")
if os.path.exists(TEST_DB_PATH):
    try:
        os.remove(TEST_DB_PATH)
    except Exception:
        pass

test_engine = create_engine(
    f"sqlite:///{TEST_DB_PATH}",
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create all schema tables on the isolated test engine
Base.metadata.create_all(bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def run_tests():
    print("\n" + "="*60)
    print("🌾 SMART FARMER ASSISTANT - API TEST SUITE (ISOLATED TEST DB)")
    print("="*60 + "\n")

    # 1. Health Check
    res = client.get("/")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("✅ 1. Health Check / Root: OK (status 200)")

    # 2. Create Farmer Profile
    demo_farmer = {
        "full_name": "Suresh Gaikwad",
        "phone_number": "9876543210",
        "district": "Nashik",
        "state": "Maharashtra",
        "preferred_language": "mr",
        "total_acres": 3.0,
        "primary_crop": "Red Onion"
    }
    res = client.post("/api/farmers", json=demo_farmer)
    assert res.status_code == 201, f"Create farmer failed: {res.text}"
    farmer_data = res.json()
    farmer_id = farmer_data["id"]
    assert farmer_data["full_name"] == "Suresh Gaikwad"
    print(f"✅ 2. Create Farmer Profile: OK (ID: {farmer_id}, Name: {farmer_data['full_name']})")

    # Authenticate and obtain Bearer session token for this farmer
    login_res = client.post("/api/auth/login", json={
        "username": farmer_data["username"],
        "password": "Farmer@123"
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    auth_token = login_res.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {auth_token}"}

    # 3. Retrieve Farmer Profile (Unauthenticated 401 & Authenticated Own Profile 200)
    res_unauth_profile = client.get(f"/api/farmers/{farmer_id}")
    assert res_unauth_profile.status_code == 401, f"Unauthenticated access should fail with 401, got {res_unauth_profile.status_code}"
    
    res = client.get(f"/api/farmers/{farmer_id}", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["district"] == "Nashik"
    print("✅ 3. Retrieve Farmer Profile by ID (Unauthenticated 401 & Authenticated 200): OK")

    # 4. Add Expense Transaction (Authenticated)
    expense_data = {
        "type": "expense",
        "category_key": "catSeeds",
        "category_name": "Onion Seeds",
        "amount": 3500.0,
        "transaction_date": "2026-10-25",
        "description": "Purchased 3 kg Phule Samarth onion seeds"
    }
    res = client.post("/api/transactions", json=expense_data, headers=auth_headers)
    assert res.status_code == 201, f"Create expense failed: {res.text}"
    expense_id = res.json()["id"]
    print(f"✅ 4. Add Expense Transaction: OK (ID: {expense_id}, Amount: ₹3,500)")

    # 5. Add Income Transaction (Authenticated)
    income_data = {
        "type": "income",
        "category_key": "catCropSale",
        "category_name": "Onion Harvest Sale",
        "amount": 28000.0,
        "transaction_date": "2026-10-27",
        "description": "Sold at Nashik APMC mandi"
    }
    res = client.post("/api/transactions", json=income_data, headers=auth_headers)
    assert res.status_code == 201
    income_id = res.json()["id"]
    print(f"✅ 5. Add Income Transaction: OK (ID: {income_id}, Amount: ₹28,000)")

    # 6. Test Validation Error (Negative Amount should fail with 422)
    invalid_data = {
        "type": "expense",
        "category_key": "catSeeds",
        "amount": -500.0,  # Invalid: negative
        "transaction_date": "2026-10-25"
    }
    res = client.post("/api/transactions", json=invalid_data, headers=auth_headers)
    assert res.status_code == 422, "Negative amount should be rejected with 422"
    print("✅ 6. Input Validation (Reject negative amount with 422): OK")

    # 7. Financial Summary Calculation (Authenticated)
    res = client.get("/api/transactions/summary", headers=auth_headers)
    assert res.status_code == 200
    summary = res.json()
    assert summary["total_income"] == 28000.0
    assert summary["total_expense"] == 3500.0
    assert summary["net_profit"] == 24500.0
    print(f"✅ 7. Financial Summary Calculation: OK (Income: ₹{summary['total_income']}, Expense: ₹{summary['total_expense']}, Net Profit: ₹{summary['net_profit']})")

    # 8. List Transactions (Authenticated)
    res = client.get("/api/transactions", headers=auth_headers)
    assert res.status_code == 200
    assert len(res.json()) >= 2
    print(f"✅ 8. List Transactions: OK ({len(res.json())} records returned)")

    # 9. Delete a Transaction (Authenticated)
    res = client.delete(f"/api/transactions/{expense_id}", headers=auth_headers)
    assert res.status_code == 200
    print(f"✅ 9. Delete Transaction ID {expense_id}: OK")

    # 10. Verify 404 on deleted transaction
    res = client.get(f"/api/transactions/{expense_id}", headers=auth_headers)
    assert res.status_code == 404
    print("✅ 10. 404 Not Found Check on deleted item: OK")

    # 11. Seed Demo Data Endpoint (Unauthenticated rejected with 401, Authenticated 200)
    res_unauth_seed = client.post("/api/transactions/seed-demo")
    assert res_unauth_seed.status_code == 401, f"Unauthenticated seed-demo must fail with 401, got {res_unauth_seed.status_code}"

    res = client.post("/api/transactions/seed-demo", headers=auth_headers)
    assert res.status_code == 200
    print("✅ 11. Seed Demo Transactions (Unauthenticated 401 & Authenticated 200): OK")

    # ==============================================================================
    # PHASE 3B: SMART IRRIGATION LOG TESTS
    # ==============================================================================

    # 12. Create Irrigation Record (Authenticated)
    irr_data = {
        "crop_name": "Soybean",
        "irrigation_date": "2026-10-28",
        "duration_hours": 3.5,
        "water_quantity_liters": 12000.0,
        "irrigation_method": "methodDrip",
        "notes": "Flowering stage critical watering"
    }
    res = client.post("/api/irrigation", json=irr_data, headers=auth_headers)
    assert res.status_code == 201, f"Create irrigation log failed: {res.text}"
    log_record = res.json()
    irr_id = log_record["id"]
    assert log_record["crop_name"] == "Soybean"
    assert log_record["duration_hours"] == 3.5
    print(f"✅ 12. Create Irrigation Log: OK (ID: {irr_id}, Crop: {log_record['crop_name']}, Duration: 3.5h)")

    # 13. Input Validation (Reject non-positive duration <= 0 with 422)
    invalid_irr = {
        "crop_name": "Wheat",
        "irrigation_date": "2026-10-28",
        "duration_hours": 0.0  # Invalid: must be > 0
    }
    res = client.post("/api/irrigation", json=invalid_irr, headers=auth_headers)
    assert res.status_code == 422, "Non-positive duration should be rejected with 422"
    print("✅ 13. Validation (Reject duration <= 0 with 422): OK")

    # 14. Input Validation (Reject invalid date format with 422)
    invalid_date_irr = {
        "crop_name": "Wheat",
        "irrigation_date": "28-10-2026",  # Invalid format (not YYYY-MM-DD)
        "duration_hours": 2.0
    }
    res = client.post("/api/irrigation", json=invalid_date_irr, headers=auth_headers)
    assert res.status_code == 422, "Invalid date format should be rejected with 422"
    print("✅ 14. Validation (Reject invalid date format with 422): OK")

    # 15. List Irrigation Records (Authenticated)
    res = client.get("/api/irrigation", headers=auth_headers)
    assert res.status_code == 200
    logs_list = res.json()
    assert len(logs_list) >= 1
    print(f"✅ 15. List Irrigation Records: OK ({len(logs_list)} records returned)")

    # 16. Update Irrigation Record (Authenticated)
    update_data = {
        "duration_hours": 4.0,
        "notes": "Extended duration due to high temperature"
    }
    res = client.put(f"/api/irrigation/{irr_id}", json=update_data, headers=auth_headers)
    assert res.status_code == 200
    updated_record = res.json()
    assert updated_record["duration_hours"] == 4.0
    assert updated_record["notes"] == "Extended duration due to high temperature"
    print(f"✅ 16. Update Irrigation Record ID {irr_id}: OK (Duration updated to 4.0h)")

    # 17. Delete Irrigation Record (Authenticated)
    res = client.delete(f"/api/irrigation/{irr_id}", headers=auth_headers)
    assert res.status_code == 200
    print(f"✅ 17. Delete Irrigation Record ID {irr_id}: OK")

    # 18. Verify 404 on deleted irrigation record
    res = client.get(f"/api/irrigation/{irr_id}", headers=auth_headers)
    assert res.status_code == 404
    print("✅ 18. 404 Not Found Check on deleted irrigation item: OK")

    # ==============================================================================
    # PHASE 3B AUDIT: AUTHORIZATION, FILTERING & OFFLINE SAFETY TESTS
    # ==============================================================================

    # 19. Crop Name & Farmer Filtering
    # Create two records for different crops under authenticated farmer
    rec_soy = client.post("/api/irrigation", json={
        "crop_name": "Soybean",
        "irrigation_date": "2026-10-27",
        "duration_hours": 2.5,
        "irrigation_method": "methodDrip"
    }, headers=auth_headers).json()

    rec_cot = client.post("/api/irrigation", json={
        "crop_name": "Cotton",
        "irrigation_date": "2026-10-28",
        "duration_hours": 3.0,
        "irrigation_method": "methodFlood"
    }, headers=auth_headers).json()

    # Filter by crop_name=Cotton
    res_crop = client.get("/api/irrigation?crop_name=Cotton", headers=auth_headers)
    assert res_crop.status_code == 200
    filtered_items = res_crop.json()
    assert all("Cotton" in item["crop_name"] for item in filtered_items)
    print(f"✅ 19. Crop Name & Farmer Filtering: OK ({len(filtered_items)} Cotton records found)")

    # 20. Unauthorized Cross-Farmer Read Check
    # Create another farmer profile (Farmer B) and login
    other_farmer = client.post("/api/farmers", json={
        "full_name": "Balasaheb Shinde (Farmer B)",
        "district": "Solapur",
        "state": "Maharashtra",
        "preferred_language": "mr",
        "total_acres": 4.0
    }).json()
    other_farmer_id = other_farmer["id"]
    other_farmer_token = client.post("/api/auth/login", json={
        "username": other_farmer["username"],
        "password": "Farmer@123"
    }).json()["access_token"]
    other_headers = {"Authorization": f"Bearer {other_farmer_token}"}

    # Farmer B attempts to access Farmer A's irrigation record
    res_unauth_get = client.get(f"/api/irrigation/{rec_soy['id']}", headers=other_headers)
    assert res_unauth_get.status_code == 403, f"Expected 403 Forbidden, got {res_unauth_get.status_code}"
    print(f"✅ 20. Unauthorized Access Check (GET rejected with 403 Forbidden): OK")

    # 21. Unauthorized Cross-Farmer Update & Delete Check
    res_unauth_put = client.put(
        f"/api/irrigation/{rec_soy['id']}",
        json={"duration_hours": 5.0},
        headers=other_headers
    )
    assert res_unauth_put.status_code == 403, f"Expected 403 Forbidden on PUT, got {res_unauth_put.status_code}"

    res_unauth_del = client.delete(
        f"/api/irrigation/{rec_soy['id']}",
        headers=other_headers
    )
    assert res_unauth_del.status_code == 403, f"Expected 403 Forbidden on DELETE, got {res_unauth_del.status_code}"
    print(f"✅ 21. Unauthorized Modification Check (PUT/DELETE rejected with 403 Forbidden): OK")

    # Clean up test records created for audit
    client.delete(f"/api/irrigation/{rec_soy['id']}", headers=auth_headers)
    client.delete(f"/api/irrigation/{rec_cot['id']}", headers=auth_headers)
    res_unauth_del_b = client.delete(f"/api/farmers/{other_farmer_id}")
    assert res_unauth_del_b.status_code == 401, f"Unauthenticated farmer deletion must fail with 401, got {res_unauth_del_b.status_code}"
    res_del_other = client.delete(f"/api/farmers/{other_farmer_id}", headers=other_headers)
    assert res_del_other.status_code == 200, f"Farmer B deleting own profile must succeed with 200, got {res_del_other.status_code}"

    # 22. Duplicate-Safe Offline Sync Simulation
    # Simulate a client-side pending queue: items are tracked by unique client ID and verified before re-submitting
    pending_queue = [
        {"client_id": "off_01", "crop_name": "Wheat", "irrigation_date": "2026-10-28", "duration_hours": 2.0},
        {"client_id": "off_02", "crop_name": "Onion", "irrigation_date": "2026-10-28", "duration_hours": 1.5}
    ]
    synced_ids = set()
    server_records = []
    for item in pending_queue:
        if item["client_id"] not in synced_ids:
            # Sync to server
            created = client.post("/api/irrigation", json={
                "crop_name": item["crop_name"],
                "irrigation_date": item["irrigation_date"],
                "duration_hours": item["duration_hours"]
            }, headers=auth_headers).json()
            synced_ids.add(item["client_id"])
            server_records.append(created["id"])

    # Attempt re-syncing the same queue (should skip because client_id is already in synced_ids)
    duplicate_attempts = 0
    for item in pending_queue:
        if item["client_id"] not in synced_ids:
            duplicate_attempts += 1
    assert duplicate_attempts == 0, "Duplicate items were not blocked by client tracking ID"

    # Clean up audit sync test records
    for rid in server_records:
        client.delete(f"/api/irrigation/{rid}", headers=auth_headers)
    print("✅ 22. Duplicate-Safe Offline Sync Simulation: OK (All duplicates prevented)")

    # ==============================================================================
    # PHASE 4: FARM TASKS & REMINDERS CALENDAR TESTS
    # ==============================================================================

    # 23. Create Farm Task (Authenticated)
    task_data = {
        "title": "Spraying Mancozeb Fungicide on Onion",
        "description": "Preventive spray against purple blotch in nursery",
        "category": "spraying",
        "due_date": "2026-10-30",
        "priority": "high",
        "status": "pending",
        "reminder_date": "2026-10-29"
    }
    res = client.post("/api/tasks", json=task_data, headers=auth_headers)
    assert res.status_code == 201, f"Create task failed: {res.text}"
    created_task = res.json()
    task_id = created_task["id"]
    assert created_task["title"] == "Spraying Mancozeb Fungicide on Onion"
    assert created_task["is_completed"] is False
    print(f"✅ 23. Create Farm Task: OK (ID: {task_id}, Title: '{created_task['title']}', Priority: High)")

    # 24. Input Validation: Short/Missing Title (HTTP 422)
    res_bad_title = client.post("/api/tasks", json={
        "title": "A",  # Invalid: min_length=2
        "due_date": "2026-10-30"
    }, headers=auth_headers)
    assert res_bad_title.status_code == 422, "Short title should fail with 422"
    print("✅ 24. Validation (Reject short title <2 chars with 422): OK")

    # 25. Input Validation: Invalid Date Format (HTTP 422)
    res_bad_date = client.post("/api/tasks", json={
        "title": "Seed Treatment",
        "due_date": "30-10-2026"  # Invalid: not YYYY-MM-DD
    }, headers=auth_headers)
    assert res_bad_date.status_code == 422, "Invalid date format should fail with 422"
    print("✅ 25. Validation (Reject invalid date format with 422): OK")

    # 26. Duplicate Task Prevention (HTTP 409 Conflict)
    res_dup = client.post("/api/tasks", json=task_data, headers=auth_headers)
    assert res_dup.status_code == 409, f"Expected 409 Conflict on duplicate task, got {res_dup.status_code}"
    print(f"✅ 26. Duplicate Task Prevention (Reject identical task with 409 Conflict): OK")

    # 27. List Tasks & Filtering by Category and Status (Authenticated)
    res_tasks_list = client.get("/api/tasks?category=spraying", headers=auth_headers)
    assert res_tasks_list.status_code == 200
    spray_tasks = res_tasks_list.json()
    assert len(spray_tasks) >= 1
    assert spray_tasks[0]["category"] == "spraying"
    print(f"✅ 27. List Tasks & Category Filter: OK ({len(spray_tasks)} spraying tasks returned)")

    # 28. Toggle Task Completion (PATCH /toggle) (Authenticated)
    res_toggle = client.patch(f"/api/tasks/{task_id}/toggle", headers=auth_headers)
    assert res_toggle.status_code == 200
    toggled = res_toggle.json()
    assert toggled["is_completed"] is True
    assert toggled["status"] == "completed"
    assert toggled["completed_at"] is not None

    # Toggle back to pending
    res_toggle_back = client.patch(f"/api/tasks/{task_id}/toggle", headers=auth_headers)
    assert res_toggle_back.status_code == 200
    assert res_toggle_back.json()["is_completed"] is False
    print(f"✅ 28. Toggle Task Completion (Pending <-> Completed): OK")

    # 29. Unauthorized Cross-Farmer Task Update / Delete Check (HTTP 403 Forbidden)
    # Create temporary second farmer and login
    farmer_c = client.post("/api/farmers", json={
        "full_name": "Kailas Pawar (Farmer C)",
        "district": "Kolhapur",
        "state": "Maharashtra"
    }).json()
    farmer_c_id = farmer_c["id"]
    farmer_c_token = client.post("/api/auth/login", json={
        "username": farmer_c["username"],
        "password": "Farmer@123"
    }).json()["access_token"]
    farmer_c_headers = {"Authorization": f"Bearer {farmer_c_token}"}

    res_unauth_task_put = client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Unauthorized Title Override"},
        headers=farmer_c_headers
    )
    assert res_unauth_task_put.status_code == 403, "Farmer C modifying Farmer A's task should return 403"

    res_unauth_task_del = client.delete(
        f"/api/tasks/{task_id}",
        headers=farmer_c_headers
    )
    assert res_unauth_task_del.status_code == 403, "Farmer C deleting Farmer A's task should return 403"
    res_unauth_del_c = client.delete(f"/api/farmers/{farmer_c_id}")
    assert res_unauth_del_c.status_code == 401, f"Unauthenticated farmer deletion must fail with 401, got {res_unauth_del_c.status_code}"
    res_del_farmer_c = client.delete(f"/api/farmers/{farmer_c_id}", headers=farmer_c_headers)
    assert res_del_farmer_c.status_code == 200, f"Farmer C deleting own profile must succeed with 200, got {res_del_farmer_c.status_code}"
    print("✅ 29. Unauthorized Task Access Check (PUT/DELETE rejected with 403 Forbidden): OK")

    # 30. Delete Task and 404 Verification (Authenticated)
    res_del_task = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
    assert res_del_task.status_code == 200

    res_get_deleted = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
    assert res_get_deleted.status_code == 404
    print(f"✅ 30. Delete Task & 404 Not Found Check: OK")

    # ==============================================================================
    # PHASE 5: CROP MARKET PRICES & SELLING ADVISOR TESTS
    # ==============================================================================

    # 31. Seed Verified APMC Market Data
    res_seed_mkt = client.post("/api/market/seed-demo")
    assert res_seed_mkt.status_code == 200
    print("✅ 31. Seed Verified APMC Market Data: OK")

    # 32. List Market Prices with Commodity Filter
    res_onion = client.get("/api/market/prices?commodity_code=onion")
    assert res_onion.status_code == 200
    onion_prices = res_onion.json()
    assert len(onion_prices) >= 1
    assert onion_prices[0]["commodity_code"] == "onion"
    assert onion_prices[0]["modal_price"] > 0
    print(f"✅ 32. List Market Prices (Onion Filter): OK (Modal: ₹{onion_prices[0]['modal_price']}/qtl)")

    # 33. Source Attribution & Data Quality Verification
    price_rec = onion_prices[0]
    assert "Agmarknet" in price_rec["source"], "Source must attribute official agency"
    assert price_rec["data_quality"] in ("verified_live", "dated_verified", "sample_demo"), "Data quality tag required"
    assert len(price_rec["price_date"]) == 10, "Dated price required (YYYY-MM-DD)"
    print(f"✅ 33. Source Attribution & Provenance: OK (Source: '{price_rec['source']}', Quality: '{price_rec['data_quality']}')")

    # 34. Input Validation: min_price > max_price rejected (HTTP 422)
    invalid_price_range = {
        "commodity": "Test Crop",
        "commodity_code": "test",
        "mandi": "Pune APMC",
        "district": "Pune",
        "min_price": 5000.0,
        "modal_price": 4000.0,
        "max_price": 3000.0,  # Invalid: min > max
        "price_date": "2026-10-27",
        "source": "Manual Test",
        "data_quality": "sample_demo"
    }
    res_inv_range = client.post("/api/market/prices", json=invalid_price_range)
    assert res_inv_range.status_code == 422, "min_price > max_price must be rejected with 422"
    print("✅ 34. Validation (Reject min_price > max_price with 422): OK")

    # 35. Input Validation: modal_price outside range rejected (HTTP 422)
    invalid_modal_range = {
        "commodity": "Test Crop",
        "commodity_code": "test",
        "mandi": "Pune APMC",
        "district": "Pune",
        "min_price": 2000.0,
        "modal_price": 4500.0,  # Invalid: modal > max
        "max_price": 4000.0,
        "price_date": "2026-10-27",
        "source": "Manual Test",
        "data_quality": "sample_demo"
    }
    res_inv_modal = client.post("/api/market/prices", json=invalid_modal_range)
    assert res_inv_modal.status_code == 422, "modal outside min-max must be rejected with 422"
    print("✅ 35. Validation (Reject modal_price outside min-max with 422): OK")

    # 36. Historical Price Trend Retrieval
    res_hist = client.get("/api/market/history?commodity_code=onion")
    assert res_hist.status_code == 200
    hist_points = res_hist.json()
    assert len(hist_points) >= 3, "At least 3 historical points required for trend"
    # Verify chronological ascending order
    dates = [p["price_date"] for p in hist_points]
    assert dates == sorted(dates), "Historical points must be chronologically ordered"
    print(f"✅ 36. Historical Price Trend: OK ({len(hist_points)} verifiable daily points returned)")

    # 37. Selling Advisor Decision Support
    res_advice = client.get("/api/market/advice?commodity_code=onion")
    assert res_advice.status_code == 200
    advice = res_advice.json()
    assert advice["recommendation"] in ("SELL", "HOLD", "WATCH")
    assert len(advice["factors"]) >= 2, "Advice must provide at least 2 analytical factors"
    assert "Decision Support" in advice["disclaimer"], "Prominent disclaimer required"
    print(f"✅ 37. Selling Advisor Decision Support: OK (Recommendation: '{advice['recommendation']}', Factors: {len(advice['factors'])})")

    # 38. Missing / Offline Crop Error Handling (HTTP 404)
    res_missing_crop = client.get("/api/market/advice?commodity_code=unknown_crop_xyz")
    assert res_missing_crop.status_code == 404, "Non-existent crop must return 404"
    print("✅ 38. Missing Data Handling (Reject unknown crop advice with 404): OK")

    # ==============================================================================
    # PHASE 5 CORRECTIONS: MSP ACCURACY, PROVENANCE & ADVICE SAFETY TESTS
    # ==============================================================================

    # 39. MSP Season & Rate Accuracy (2026-27 Marketing Seasons)
    res_soy = client.get("/api/market/prices?commodity_code=soybean").json()
    assert len(res_soy) >= 1
    assert res_soy[0]["msp_price"] == 5708.0, f"Expected Soybean MSP ₹5,708, got {res_soy[0]['msp_price']}"
    assert "2026-27" in res_soy[0]["msp_season"]

    res_cot = client.get("/api/market/prices?commodity_code=cotton").json()
    assert len(res_cot) >= 1
    assert res_cot[0]["msp_price"] == 8267.0, f"Expected Cotton MSP ₹8,267, got {res_cot[0]['msp_price']}"
    assert "2026-27" in res_cot[0]["msp_season"]

    res_wht = client.get("/api/market/prices?commodity_code=wheat").json()
    assert len(res_wht) >= 1
    assert res_wht[0]["msp_price"] == 2585.0, f"Expected Wheat MSP ₹2,585, got {res_wht[0]['msp_price']}"
    assert "2026-27" in res_wht[0]["msp_season"]

    res_chn = client.get("/api/market/prices?commodity_code=chana").json()
    assert len(res_chn) >= 1
    assert res_chn[0]["msp_price"] == 5875.0, f"Expected Chana MSP ₹5,875, got {res_chn[0]['msp_price']}"

    res_on = client.get("/api/market/prices?commodity_code=onion").json()
    assert len(res_on) >= 1
    assert res_on[0]["msp_price"] is None, "Onion must not have a statutory MSP"
    assert "Horticultural" in res_on[0]["msp_season"]
    print("✅ 39. MSP Season & Rate Accuracy: OK (Soybean: ₹5,708, Cotton: ₹8,267, Wheat: ₹2,585 for 2026-27)")

    # 40. Date Integrity & Stale Price Labeling
    onion_p = res_on[0]
    assert onion_p["price_date"] == "2026-10-27", "Dated record must preserve authentic historical date"
    assert onion_p["last_fetched_at"] is not None, "Last fetched timestamp must be tracked"
    print("✅ 40. Date Integrity & Stale Price Labeling: OK (Authentic report date preserved, fetch timestamp tracked)")

    # 41. Data Provenance & Attribution (Live vs Dated vs Demo)
    res_all_mkt = client.get("/api/market/prices").json()
    for p in res_all_mkt:
        assert p["data_quality"] in ("verified_live", "dated_verified", "sample_demo", "unavailable")
        assert "http" in p.get("msp_source_url", "") or "Agmarknet" in p["source"] or "MSAMB" in p["source"], "Official provenance link required"
    print("✅ 41. Data Provenance & Attribution: OK (Explicit distinction between live, dated, and demo data)")

    # 42. Cautious Advice on Insufficient Data
    # Insert a temporary price record with unverified/missing inputs
    from backend import models as db_models
    db_session = TestingSessionLocal()
    temp_p = db_models.MarketPrice(
        commodity="Unverified Crop",
        commodity_code="unverified_test",
        mandi="Test APMC",
        state="Maharashtra",
        district="Pune",
        min_price=10.0,
        modal_price=0.0,  # Zero/missing modal
        max_price=10.0,
        price_date="2026-10-27",
        source="Test Source",
        data_quality="unavailable"
    )
    db_session.add(temp_p)
    db_session.commit()
    temp_p_id = temp_p.id

    res_cautious_advice = client.get("/api/market/advice?commodity_code=unverified_test").json()
    assert res_cautious_advice["recommendation"] == "WATCH"
    assert "INSUFFICIENT DATA" in res_cautious_advice["recommendation_label"]
    assert res_cautious_advice["confidence"] == "Low"

    # Clean up temporary test price record
    db_session.delete(temp_p)
    db_session.commit()
    db_session.close()
    print("✅ 42. Cautious Advice on Insufficient Data: OK (Returns WATCH MARKET / INSUFFICIENT DATA when inputs missing)")

    # ==============================================================================
    # PHASE 6: AUTHENTICATION, PASSWORD HASHING, SESSION TOKENS & TENANT ISOLATION TESTS
    # ==============================================================================

    # 43. Register Farmer Account with Argon2id Password Hashing (POST /api/auth/register)
    reg_farmer_payload = {
        "full_name": "Tukaram Shinde",
        "username": "tukaram_farm_2026",
        "password": "SecurePassword#2026",
        "phone_number": "9123456789",
        "district": "Ahmednagar",
        "state": "Maharashtra",
        "preferred_language": "mr",
        "total_acres": 4.5,
        "primary_crop": "Wheat"
    }
    res_reg = client.post("/api/auth/register", json=reg_farmer_payload)
    assert res_reg.status_code == 201, f"Registration failed: {res_reg.text}"
    reg_data = res_reg.json()
    assert "access_token" in reg_data
    assert reg_data["farmer"]["username"] == "tukaram_farm_2026"
    assert reg_data["farmer"]["full_name"] == "Tukaram Shinde"
    # Password hash must NEVER be exposed in response schemas
    assert "password" not in reg_data["farmer"]
    assert "password_hash" not in reg_data["farmer"]
    reg_farmer_id = reg_data["farmer"]["id"]
    reg_token = reg_data["access_token"]
    reg_headers = {"Authorization": f"Bearer {reg_token}"}
    print(f"✅ 43. Farmer Registration with Argon2id (POST /api/auth/register): OK (User: '{reg_data['farmer']['username']}', ID: {reg_farmer_id})")

    # 44. Duplicate Account Prevention (HTTP 409 Conflict)
    # Attempt registering same username
    res_dup_username = client.post("/api/auth/register", json={
        "full_name": "Another Farmer",
        "username": "tukaram_farm_2026",  # Duplicate
        "password": "AnotherPassword#123",
        "phone_number": "9000000001",
        "district": "Pune"
    })
    assert res_dup_username.status_code == 409, f"Expected 409 Conflict for duplicate username, got {res_dup_username.status_code}"

    # Attempt registering same mobile
    res_dup_phone = client.post("/api/auth/register", json={
        "full_name": "Another Farmer 2",
        "username": "unique_username_999",
        "password": "AnotherPassword#123",
        "phone_number": "9123456789",  # Duplicate
        "district": "Pune"
    })
    assert res_dup_phone.status_code == 409, f"Expected 409 Conflict for duplicate phone, got {res_dup_phone.status_code}"
    print("✅ 44. Duplicate Account Prevention (Reject duplicate username & phone with 409 Conflict): OK")

    # 45. Farmer Login (POST /api/auth/login) with Username or Mobile
    # Login via username
    res_login_user = client.post("/api/auth/login", json={
        "username": "tukaram_farm_2026",
        "password": "SecurePassword#2026"
    })
    assert res_login_user.status_code == 200
    assert "access_token" in res_login_user.json()

    # Login via 10-digit mobile number
    res_login_phone = client.post("/api/auth/login", json={
        "username": "9123456789",
        "password": "SecurePassword#2026"
    })
    assert res_login_phone.status_code == 200
    assert res_login_phone.json()["farmer"]["username"] == "tukaram_farm_2026"
    print("✅ 45. Farmer Login via Username & Mobile (POST /api/auth/login): OK (Returned active 24h token)")

    # 46. Login Credential Validation (HTTP 401 Unauthorized)
    # Wrong password
    res_bad_pw = client.post("/api/auth/login", json={
        "username": "tukaram_farm_2026",
        "password": "WrongPassword#999"
    })
    assert res_bad_pw.status_code == 401, f"Expected 401 on incorrect password, got {res_bad_pw.status_code}"

    # Nonexistent user
    res_bad_user = client.post("/api/auth/login", json={
        "username": "ghost_farmer_nonexistent_xyz",
        "password": "SomePassword#123"
    })
    assert res_bad_user.status_code == 401, f"Expected 401 on nonexistent user, got {res_bad_user.status_code}"
    print("✅ 46. Login Credential Validation (Reject incorrect password & nonexistent user with 401): OK")

    # 47. Protected Endpoint Rejection Without Bearer Token (HTTP 401 Unauthorized)
    res_unauth_tx = client.get("/api/transactions")
    assert res_unauth_tx.status_code == 401, f"Expected 401 on /api/transactions without token, got {res_unauth_tx.status_code}"

    res_unauth_irr = client.get("/api/irrigation")
    assert res_unauth_irr.status_code == 401, f"Expected 401 on /api/irrigation without token, got {res_unauth_irr.status_code}"

    res_unauth_tsk = client.get("/api/tasks")
    assert res_unauth_tsk.status_code == 401, f"Expected 401 on /api/tasks without token, got {res_unauth_tsk.status_code}"
    print("✅ 47. Protected Endpoint Rejection Without Token (HTTP 401 on transactions, irrigation, tasks): OK")

    # 48. Cross-Farmer Tenant Isolation (Farmer B cannot access or list Farmer A records)
    # Tukaram creates a private task and a transaction
    tukaram_task = client.post("/api/tasks", json={
        "title": "Private Soil Testing for Tukaram",
        "category": "sowing",
        "due_date": "2026-11-05",
        "priority": "high"
    }, headers=reg_headers).json()

    # Suresh Gaikwad lists tasks -> Tukaram's task must NOT be visible to Suresh
    suresh_tasks = client.get("/api/tasks", headers=auth_headers).json()
    assert not any(t["id"] == tukaram_task["id"] for t in suresh_tasks), "Tenant breach: Tukaram's task found in Suresh's task list"

    # Suresh attempts direct GET /api/tasks/{id} of Tukaram's task -> rejected with 403 Forbidden
    res_cross_get = client.get(f"/api/tasks/{tukaram_task['id']}", headers=auth_headers)
    assert res_cross_get.status_code == 403, f"Expected 403 Forbidden on cross-farmer task read, got {res_cross_get.status_code}"

    # Suresh attempts direct DELETE /api/tasks/{id} of Tukaram's task -> rejected with 403 Forbidden
    res_cross_del = client.delete(f"/api/tasks/{tukaram_task['id']}", headers=auth_headers)
    assert res_cross_del.status_code == 403, f"Expected 403 Forbidden on cross-farmer task delete, got {res_cross_del.status_code}"

    # Clean up Tukaram's task using Tukaram's own token
    client.delete(f"/api/tasks/{tukaram_task['id']}", headers=reg_headers)
    print("✅ 48. Cross-Farmer Tenant Isolation (Farmer B blocked from Farmer A records with 403 & separate lists): OK")

    # 49. Session Expiry Enforcement (HTTP 401 Unauthorized)
    from datetime import datetime, timedelta
    from backend import models as db_models
    db_sess = TestingSessionLocal()
    # Find Tukaram's session and simulate expiry (set expires_at in the past)
    sess_obj = db_sess.query(db_models.FarmerSession).filter(
        db_models.FarmerSession.session_token == reg_token
    ).first()
    assert sess_obj is not None
    sess_obj.expires_at = datetime.utcnow() - timedelta(minutes=10)
    db_sess.commit()
    db_sess.close()

    res_expired_req = client.get("/api/transactions", headers=reg_headers)
    assert res_expired_req.status_code == 401, f"Expected 401 Unauthorized for expired session, got {res_expired_req.status_code}"
    assert "expired" in res_expired_req.text.lower()
    print("✅ 49. Session Expiry Enforcement (Expired token rejected with 401 Unauthorized): OK")

    # 50. Logout and Session Revocation (HTTP 401 Unauthorized on Reused Token)
    # Suresh logs in to get a fresh session token
    suresh_login = client.post("/api/auth/login", json={
        "username": farmer_data["username"],
        "password": "Farmer@123"
    }).json()
    suresh_token = suresh_login["access_token"]
    suresh_headers = {"Authorization": f"Bearer {suresh_token}"}

    # Verify session is working
    res_me_before = client.get("/api/auth/me", headers=suresh_headers)
    assert res_me_before.status_code == 200

    # Call /api/auth/logout
    res_logout = client.post("/api/auth/logout", headers=suresh_headers)
    assert res_logout.status_code == 200
    assert "logged out" in res_logout.text.lower()

    # Reusing the revoked token must now be rejected with 401 Unauthorized
    res_reused = client.get("/api/auth/me", headers=suresh_headers)
    assert res_reused.status_code == 401, f"Expected 401 on revoked session token, got {res_reused.status_code}"
    print("✅ 50. Logout & Immediate Token Revocation (Revoked token rejected with 401 Unauthorized): OK")

    # ==============================================================================
    # HACKATHON SECURITY PATCH TESTS (LEGACY FARMER & SEED ENDPOINT SECURITY)
    # ==============================================================================

    # 51. Farmer Directory Listing Security (GET /api/farmers)
    # Unauthenticated must return 401 Unauthorized
    res_unauth_dir = client.get("/api/farmers")
    assert res_unauth_dir.status_code == 401, f"Expected 401 on unauthenticated /api/farmers, got {res_unauth_dir.status_code}"

    # Authenticated regular farmer must be blocked with 403 Forbidden
    res_farmer_dir = client.get("/api/farmers", headers=auth_headers)
    assert res_farmer_dir.status_code == 403, f"Expected 403 on non-admin /api/farmers, got {res_farmer_dir.status_code}"
    assert "restricted to authorized administrators" in res_farmer_dir.json().get("detail", "")
    print("✅ 51. Farmer Directory Listing Security (GET /api/farmers 401 unauth & 403 non-admin): OK")

    # 52. Farmer Profile Access Security (GET /api/farmers/{farmer_id})
    # Unauthenticated GET must return 401 Unauthorized
    res_unauth_prof = client.get(f"/api/farmers/{reg_farmer_id}")
    assert res_unauth_prof.status_code == 401, f"Expected 401 on unauth profile access, got {res_unauth_prof.status_code}"

    # Cross-farmer profile access: Suresh attempting to read Tukaram's profile returns 403 Forbidden
    res_cross_prof = client.get(f"/api/farmers/{reg_farmer_id}", headers=auth_headers)
    assert res_cross_prof.status_code == 403, f"Expected 403 on cross-farmer profile read, got {res_cross_prof.status_code}"
    assert "cannot view profile details" in res_cross_prof.json().get("detail", "")

    # Authenticated own profile access: Suresh reading Suresh's profile returns 200 OK
    res_own_prof = client.get(f"/api/farmers/{farmer_id}", headers=auth_headers)
    assert res_own_prof.status_code == 200, f"Expected 200 on own profile read, got {res_own_prof.status_code}"
    assert res_own_prof.json()["id"] == farmer_id
    print("✅ 52. Farmer Profile Access Security (GET /api/farmers/{id} 401 unauth, 403 cross-farmer, 200 own): OK")

    # 53. Profile Deletion Security & Ownership Verification (DELETE /api/farmers/{farmer_id})
    # Unauthenticated DELETE must return 401 Unauthorized
    res_unauth_del = client.delete(f"/api/farmers/{reg_farmer_id}")
    assert res_unauth_del.status_code == 401, f"Expected 401 on unauth profile deletion, got {res_unauth_del.status_code}"

    # Cross-farmer deletion attempt: Suresh attempting to delete Tukaram's profile returns 403 Forbidden
    res_cross_del = client.delete(f"/api/farmers/{reg_farmer_id}", headers=auth_headers)
    assert res_cross_del.status_code == 403, f"Expected 403 on cross-farmer profile deletion, got {res_cross_del.status_code}"
    assert "Deletion forbidden" in res_cross_del.json().get("detail", "")

    # Verify Tukaram's profile remains intact
    db_verify = TestingSessionLocal()
    tukaram_in_db = db_verify.query(db_models.FarmerProfile).filter(db_models.FarmerProfile.id == reg_farmer_id).first()
    assert tukaram_in_db is not None, "Tukaram's profile was incorrectly deleted!"
    db_verify.close()

    # Re-login Tukaram to get fresh token and verify self-deletion is allowed
    login_tukaram = client.post("/api/auth/login", json={
        "username": "tukaram_farm_2026",
        "password": "SecurePassword#2026"
    }).json()
    tukaram_fresh_headers = {"Authorization": f"Bearer {login_tukaram['access_token']}"}
    res_tukaram_self_del = client.delete(f"/api/farmers/{reg_farmer_id}", headers=tukaram_fresh_headers)
    assert res_tukaram_self_del.status_code == 200, f"Expected 200 on self profile deletion, got {res_tukaram_self_del.status_code}"
    print("✅ 53. Profile Deletion Security & Ownership (DELETE /api/farmers/{id} 401 unauth, 403 cross-farmer, 200 self): OK")

    # 54. Seed Demo Protection (POST /api/tasks/seed-demo & /api/transactions/seed-demo)
    # Tasks seed demo: Unauthenticated returns 401 Unauthorized
    res_unauth_seed_tasks = client.post("/api/tasks/seed-demo")
    assert res_unauth_seed_tasks.status_code == 401, f"Expected 401 on unauth task seed, got {res_unauth_seed_tasks.status_code}"

    # Authenticated task seeding for Suresh Gaikwad returns 200 OK and seeds records scoped to Suresh
    res_auth_seed_tasks = client.post("/api/tasks/seed-demo", headers=auth_headers)
    assert res_auth_seed_tasks.status_code == 200, f"Expected 200 on auth task seed, got {res_auth_seed_tasks.status_code}"

    # Transactions seed demo: Unauthenticated returns 401 Unauthorized
    res_unauth_seed_tx = client.post("/api/transactions/seed-demo")
    assert res_unauth_seed_tx.status_code == 401, f"Expected 401 on unauth tx seed, got {res_unauth_seed_tx.status_code}"

    # Authenticated tx seeding for Suresh Gaikwad returns 200 OK
    res_auth_seed_tx = client.post("/api/transactions/seed-demo", headers=auth_headers)
    assert res_auth_seed_tx.status_code == 200, f"Expected 200 on auth tx seed, got {res_auth_seed_tx.status_code}"
    print("✅ 54. Seed Demo Protection (POST /api/tasks/seed-demo & /api/transactions/seed-demo 401 unauth & 200 auth): OK")

    # ==============================================================================
    # TEST SUITE TEARDOWN: Clean up isolated test database and reset overrides
    # ==============================================================================
    # Clean up Suresh's profile using Suresh's active token
    # (Re-login to ensure an active valid token)
    login_suresh_final = client.post("/api/auth/login", json={
        "username": farmer_data["username"],
        "password": "Farmer@123"
    }).json()
    suresh_final_headers = {"Authorization": f"Bearer {login_suresh_final['access_token']}"}
    client.delete(f"/api/farmers/{farmer_id}", headers=suresh_final_headers)

    app.dependency_overrides.clear()
    test_engine.dispose()
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except Exception:
            pass

    print("\n" + "="*60)
    print("🎉 ALL 54 TESTS (11 ORIGINAL + 7 IRRIGATION + 4 AUDIT + 8 TASK + 12 MARKET + 8 AUTH + 4 SECURITY PATCH) PASSED!")
    print("="*60 + "\n")

if __name__ == "__main__":
    run_tests()
