/* ==========================================================================
   Smart Farmer Assistant - Module 3: Real Weather & Rainfall Integration
   Powered by Open-Meteo Weather API with verified Indian agricultural coordinates
   ========================================================================== */

const indianAgriLocations = {
  maharashtra: {
    name: { en: "Maharashtra", mr: "महाराष्ट्र", hi: "महाराष्ट्र" },
    districts: {
      pune: { name: { en: "Pune", mr: "पुणे", hi: "पुणे" }, lat: 18.5204, lon: 73.8567 },
      nashik: { name: { en: "Nashik", mr: "नाशिक", hi: "नासिक" }, lat: 19.9975, lon: 73.7898 },
      nagpur: { name: { en: "Nagpur (Vidarbha)", mr: "नागपूर (विदर्भ)", hi: "नागपुर (विदर्भ)" }, lat: 21.1458, lon: 79.0882 },
      aurangabad: { name: { en: "Chhatrapati Sambhajinagar", mr: "छत्रपती संभाजीनगर", hi: "छत्रपति संभाजीनगर" }, lat: 19.8762, lon: 75.3433 },
      kolhapur: { name: { en: "Kolhapur", mr: "कोल्हापूर", hi: "कोल्हापुर" }, lat: 16.7050, lon: 74.2433 },
      solapur: { name: { en: "Solapur", mr: "सोलापूर", hi: "सोलापुर" }, lat: 17.6599, lon: 75.9064 },
      amravati: { name: { en: "Amravati", mr: "अमरावती", hi: "अमरावती" }, lat: 20.9374, lon: 77.7796 },
      jalgaon: { name: { en: "Jalgaon", mr: "जळगाव", hi: "जलगांव" }, lat: 21.0077, lon: 75.5626 },
      latur: { name: { en: "Latur (Marathwada)", mr: "लातूर (मराठवाडा)", hi: "लातूर (मराठवाड़ा)" }, lat: 18.4088, lon: 76.5604 },
      ahmednagar: { name: { en: "Ahmednagar", mr: "अहमदनगर", hi: "अहमदनगर" }, lat: 19.0948, lon: 74.7480 }
    }
  },
  madhya_pradesh: {
    name: { en: "Madhya Pradesh", mr: "मध्य प्रदेश", hi: "मध्य प्रदेश" },
    districts: {
      indore: { name: { en: "Indore (Malwa)", mr: "इंदूर (माळवा)", hi: "इंदौर (मालवा)" }, lat: 22.7196, lon: 75.8577 },
      bhopal: { name: { en: "Bhopal", mr: "भोपाळ", hi: "भोपाल" }, lat: 23.2599, lon: 77.4126 },
      ujjain: { name: { en: "Ujjain", mr: "उज्जैन", hi: "उज्जैन" }, lat: 23.1765, lon: 75.7885 }
    }
  },
  gujarat: {
    name: { en: "Gujarat", mr: "गुजरात", hi: "गुजरात" },
    districts: {
      rajkot: { name: { en: "Rajkot (Saurashtra)", mr: "राजकोट (सौराष्ट्र)", hi: "राजकोट (सौराष्ट्र)" }, lat: 22.3039, lon: 70.8022 },
      surat: { name: { en: "Surat", mr: "सुरत", hi: "सूरत" }, lat: 21.1702, lon: 72.8311 },
      ahmedabad: { name: { en: "Ahmedabad", mr: "अहमदाबाद", hi: "अहमदाबाद" }, lat: 23.0225, lon: 72.5714 }
    }
  },
  punjab: {
    name: { en: "Punjab / Haryana", mr: "पंजाब / हरियाणा", hi: "पंजाब / हरियाणा" },
    districts: {
      ludhiana: { name: { en: "Ludhiana", mr: "लुधियाना", hi: "लुधियाना" }, lat: 30.9010, lon: 75.8573 },
      karnal: { name: { en: "Karnal", mr: "कर्नाल", hi: "करनाल" }, lat: 29.6857, lon: 76.9905 }
    }
  },
  karnataka: {
    name: { en: "Karnataka", mr: "कर्नाटक", hi: "कर्नाटक" },
    districts: {
      belagavi: { name: { en: "Belagavi", mr: "बेळगाव", hi: "बेलगावी" }, lat: 15.8497, lon: 74.4977 },
      dharwad: { name: { en: "Dharwad", mr: "धारवाड", hi: "धारवाड़" }, lat: 15.4589, lon: 75.0078 }
    }
  },
  uttar_pradesh: {
    name: { en: "Uttar Pradesh", mr: "उत्तर प्रदेश", hi: "उत्तर प्रदेश" },
    districts: {
      varanasi: { name: { en: "Varanasi", mr: "वाराणसी", hi: "वाराणसी" }, lat: 25.3176, lon: 82.9739 },
      lucknow: { name: { en: "Lucknow", mr: "लखनौ", hi: "लखनऊ" }, lat: 26.8467, lon: 80.9462 }
    }
  }
};

// Weather Code Interpretation Map (WMO standard)
function getWmoCondition(code, lang) {
  const dict = translations[lang] || translations.en;
  if (code === 0) return { label: dict.wmoClearSky, icon: "☀️" };
  if (code === 1 || code === 2) return { label: dict.wmoPartlyCloudy, icon: "🌤️" };
  if (code === 3) return { label: dict.wmoOvercast, icon: "☁️" };
  if (code === 45 || code === 48) return { label: dict.wmoFog, icon: "🌫️" };
  if (code >= 51 && code <= 57) return { label: dict.wmoDrizzle, icon: "🌦️" };
  if (code >= 61 && code <= 67) return { label: dict.wmoRain, icon: "🌧️" };
  if (code >= 80 && code <= 82) return { label: dict.wmoHeavyRain, icon: "⛈️" };
  if (code >= 95) return { label: dict.wmoThunderstorm, icon: "⛈️" };
  return { label: dict.wmoPartlyCloudy, icon: "⛅" };
}

// Convert wind direction in degrees to cardinal points
function getWindDirectionName(degrees) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
}

// Current Selected State & District Keys
let selectedStateKey = localStorage.getItem("smart_farmer_weather_state") || "maharashtra";
let selectedDistrictKey = localStorage.getItem("smart_farmer_weather_district") || "pune";

// Populate State & District Dropdowns
function initWeatherSelectors() {
  const lang = window.currentLanguage || "en";
  const stateSelect = document.getElementById("weather-state-select");
  const districtSelect = document.getElementById("weather-district-select");

  if (!stateSelect || !districtSelect) return;

  // Populate States
  stateSelect.innerHTML = "";
  Object.keys(indianAgriLocations).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = indianAgriLocations[key].name[lang] || indianAgriLocations[key].name.en;
    if (key === selectedStateKey) opt.selected = true;
    stateSelect.appendChild(opt);
  });

  // Populate Districts for selected state
  populateDistricts(selectedStateKey, selectedDistrictKey);

  // State Change Listener
  stateSelect.onchange = (e) => {
    selectedStateKey = e.target.value;
    localStorage.setItem("smart_farmer_weather_state", selectedStateKey);
    const firstDistrictKey = Object.keys(indianAgriLocations[selectedStateKey].districts)[0];
    selectedDistrictKey = firstDistrictKey;
    localStorage.setItem("smart_farmer_weather_district", selectedDistrictKey);
    populateDistricts(selectedStateKey, selectedDistrictKey);
    fetchLiveWeather();
  };

  // District Change Listener
  districtSelect.onchange = (e) => {
    selectedDistrictKey = e.target.value;
    localStorage.setItem("smart_farmer_weather_district", selectedDistrictKey);
    fetchLiveWeather();
  };
}

function populateDistricts(stateKey, preselectedDistrict) {
  const lang = window.currentLanguage || "en";
  const districtSelect = document.getElementById("weather-district-select");
  if (!districtSelect) return;

  const stateData = indianAgriLocations[stateKey];
  if (!stateData) return;

  districtSelect.innerHTML = "";
  const districtKeys = Object.keys(stateData.districts);

  districtKeys.forEach(dKey => {
    const dData = stateData.districts[dKey];
    const opt = document.createElement("option");
    opt.value = dKey;
    opt.textContent = dData.name[lang] || dData.name.en;
    if (dKey === preselectedDistrict) opt.selected = true;
    districtSelect.appendChild(opt);
  });
}

// Fetch Real Weather from Open-Meteo
async function fetchLiveWeather() {
  const lang = window.currentLanguage || "en";
  const stateData = indianAgriLocations[selectedStateKey];
  if (!stateData) return;
  const districtData = stateData.districts[selectedDistrictKey];
  if (!districtData) return;

  const lat = districtData.lat;
  const lon = districtData.lon;
  const districtName = districtData.name[lang] || districtData.name.en;
  const stateName = stateData.name[lang] || stateData.name.en;
  const locationLabel = `${districtName}, ${stateName}`;

  // Update header text immediately to reflect selection
  const locElem = document.getElementById("weather-location-name");
  if (locElem) locElem.textContent = locationLabel;

  // Show Loading indicator in status badge
  const statusBadge = document.getElementById("weather-status-badge");
  if (statusBadge) {
    statusBadge.className = "badge badge-info";
    statusBadge.textContent = translations[lang].loadingWeather;
  }

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=precipitation,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }

    const data = await response.json();

    // Cache successful data
    const cachePayload = {
      timestamp: new Date().toISOString(),
      locationLabel,
      data
    };
    localStorage.setItem("smart_farmer_weather_cache", JSON.stringify(cachePayload));

    // Render Live Weather
    renderWeatherData(data, locationLabel, false, new Date());

  } catch (error) {
    console.warn("Live weather fetch failed, checking cache:", error);

    // Check if cache exists
    const cachedStr = localStorage.getItem("smart_farmer_weather_cache");
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        renderWeatherData(cached.data, cached.locationLabel, true, new Date(cached.timestamp));
        return;
      } catch (e) {
        console.error("Cache read failed", e);
      }
    }

    // If no cache or network failed completely, show clear error
    renderWeatherError(error.message);
  }
}

// Render Weather Data to DOM
function renderWeatherData(apiData, locationLabel, isCached, timestamp) {
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const current = apiData.current;
  const daily = apiData.daily;

  if (!current || !daily) {
    renderWeatherError("Incomplete data structure received.");
    return;
  }

  // 1. Status Badge & Location
  const statusBadge = document.getElementById("weather-status-badge");
  if (statusBadge) {
    if (isCached) {
      statusBadge.className = "badge badge-warning";
      statusBadge.innerHTML = `⚠️ ${dict.cachedDataBadge}`;
    } else {
      statusBadge.className = "badge badge-live";
      statusBadge.innerHTML = `🟢 ${dict.liveDataBadge}`;
    }
  }

  const locElem = document.getElementById("weather-location-name");
  if (locElem) locElem.textContent = locationLabel;

  // 2. Current Conditions
  const tempElem = document.getElementById("weather-temp-main");
  const condElem = document.getElementById("weather-condition-main");
  const feelsElem = document.getElementById("weather-feels-like");
  const humElem = document.getElementById("weather-humidity");
  const rainElem = document.getElementById("weather-rain");
  const windElem = document.getElementById("weather-wind");

  const wmo = getWmoCondition(current.weather_code, lang);

  if (tempElem) tempElem.textContent = `${Math.round(current.temperature_2m)}°C`;
  if (condElem) condElem.textContent = `${wmo.icon} ${wmo.label}`;
  if (feelsElem) feelsElem.textContent = `${Math.round(current.apparent_temperature)}°C`;
  if (humElem) humElem.textContent = `${current.relative_humidity_2m}%`;
  
  // Rain probability today from daily[0]
  const todayRainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
  const todayRainSum = daily.precipitation_sum ? daily.precipitation_sum[0] : 0;
  if (rainElem) rainElem.textContent = `${todayRainProb}% (${todayRainSum} mm)`;
  
  const windDir = getWindDirectionName(current.wind_direction_10m);
  if (windElem) windElem.textContent = `${Math.round(current.wind_speed_10m)} km/h ${windDir}`;

  // 3. Update Dashboard Weather KPI Card (ONLY with valid data!)
  const dashTemp = document.getElementById("dash-weather-temp");
  const dashLoc = document.getElementById("dash-weather-loc");
  const dashPreview = document.getElementById("dash-weather-temp-preview");

  if (dashTemp) dashTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
  if (dashLoc) dashLoc.textContent = locationLabel;
  if (dashPreview) dashPreview.textContent = `${Math.round(current.temperature_2m)}°C`;

  // 4. Render Agricultural Alerts (Heavy Rain, Dry Spell, Spraying)
  renderWeatherAlerts(current, daily, lang);

  // 5. Render 7-Day Forecast Grid
  renderForecastGrid(daily, lang);

  // 6. Update Metadata Card
  const updatedElem = document.getElementById("weather-last-updated");
  if (updatedElem) {
    const timeStr = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = timestamp.toLocaleDateString();
    updatedElem.textContent = `${dict.lastUpdated}: ${dateStr} ${timeStr}`;
  }

  // Remove any previous error banner if present
  const errBox = document.getElementById("weather-error-banner");
  if (errBox) errBox.style.display = "none";

  // Notify Smart Irrigation Module of fresh/cached weather data
  if (typeof updateWeatherAwareIrrigationAlert === "function") {
    updateWeatherAwareIrrigationAlert();
  }
}

// Agricultural Alerts Logic
function renderWeatherAlerts(current, daily, lang) {
  const dict = translations[lang] || translations.en;
  const container = document.getElementById("weather-advisories-wrapper");
  if (!container) return;

  container.innerHTML = "";

  // Check 1: Heavy Rain Warning
  // Threshold: Any day in forecast with precipitation_sum >= 20mm or precipitation_prob >= 75%
  let heavyRainFound = false;
  let heavyRainDay = "";
  let heavyRainAmount = 0;

  for (let i = 0; i < daily.time.length; i++) {
    const sum = daily.precipitation_sum[i] || 0;
    const prob = daily.precipitation_probability_max[i] || 0;
    if (sum >= 18 || prob >= 75) {
      heavyRainFound = true;
      heavyRainAmount = sum;
      heavyRainDay = daily.time[i];
      break;
    }
  }

  if (heavyRainFound) {
    const alertDiv = document.createElement("div");
    alertDiv.className = "weather-alert-card heavy-rain";
    alertDiv.innerHTML = `
      <div style="font-size: 1.8rem;">🌧️</div>
      <div>
        <strong style="font-size: 1.05rem; display: block; margin-bottom: 2px;">
          ${dict.heavyRainAlertTitle} (${heavyRainDay}: ${heavyRainAmount} mm)
        </strong>
        <p style="margin: 0; font-size: 0.92rem; line-height: 1.4;">
          ${dict.heavyRainAdvice}
        </p>
      </div>
    `;
    container.appendChild(alertDiv);
  }

  // Check 2: Dry Spell & Heat Warning
  // Threshold: Next 5 days total rain < 1mm and max temp >= 33°C
  let total5DayRain = 0;
  let max5DayTemp = 0;
  for (let i = 0; i < Math.min(5, daily.time.length); i++) {
    total5DayRain += daily.precipitation_sum[i] || 0;
    if (daily.temperature_2m_max[i] > max5DayTemp) max5DayTemp = daily.temperature_2m_max[i];
  }

  if (total5DayRain < 1.0 && max5DayTemp >= 33) {
    const dryDiv = document.createElement("div");
    dryDiv.className = "weather-alert-card dry-spell";
    dryDiv.innerHTML = `
      <div style="font-size: 1.8rem;">☀️</div>
      <div>
        <strong style="font-size: 1.05rem; display: block; margin-bottom: 2px;">
          ${dict.drySpellAlertTitle} (Max ${Math.round(max5DayTemp)}°C)
        </strong>
        <p style="margin: 0; font-size: 0.92rem; line-height: 1.4;">
          ${dict.drySpellAdvice}
        </p>
      </div>
    `;
    container.appendChild(dryDiv);
  }

  // Check 3: Dynamic Spraying Advisory
  // Thresholds: Safe if wind < 15 km/h AND today's rain probability < 20%
  const windSpeed = current.wind_speed_10m || 0;
  const todayRainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;

  const sprayDiv = document.createElement("div");
  let isSpraySafe = true;
  let sprayMsg = dict.sprayGood;

  if (windSpeed >= 15) {
    isSpraySafe = false;
    sprayMsg = dict.sprayHighWind;
  } else if (todayRainProb >= 25) {
    isSpraySafe = false;
    sprayMsg = dict.sprayRainRisk;
  }

  sprayDiv.className = `weather-alert-card ${isSpraySafe ? 'spray-safe' : 'spray-warn'}`;
  sprayDiv.innerHTML = `
    <div style="font-size: 1.8rem;">${isSpraySafe ? '✅' : '⚠️'}</div>
    <div>
      <strong style="font-size: 1.05rem; display: block; margin-bottom: 2px;">
        ${dict.sprayingCondition}: ${isSpraySafe ? (lang === 'mr' ? 'फवारणीसाठी अनुकूल' : (lang === 'hi' ? 'छिड़काव के लिए अनुकूल' : 'Safe to Spray')) : (lang === 'mr' ? 'फवारणी टाळा' : (lang === 'hi' ? 'छिड़काव न करें' : 'Spray Caution'))}
      </strong>
      <p style="margin: 0; font-size: 0.92rem; line-height: 1.4;">
        ${sprayMsg}
      </p>
    </div>
  `;
  container.appendChild(sprayDiv);
}

// 7-Day Forecast Grid Renderer
function renderForecastGrid(daily, lang) {
  const grid = document.getElementById("weather-forecast-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const dayNames = {
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    mr: ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"],
    hi: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]
  };
  const activeDays = dayNames[lang] || dayNames.en;

  for (let i = 0; i < daily.time.length; i++) {
    const dateObj = new Date(daily.time[i]);
    const dayOfWeek = activeDays[dateObj.getDay()];
    const isToday = i === 0;

    const wmo = getWmoCondition(daily.weather_code[i], lang);
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    const rainSum = daily.precipitation_sum[i] || 0;
    const rainProb = daily.precipitation_probability_max[i] || 0;

    const card = document.createElement("div");
    card.className = `forecast-card ${isToday ? 'today' : ''}`;
    card.innerHTML = `
      <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary-dark);">
        ${isToday ? (lang === 'mr' ? 'आज' : (lang === 'hi' ? 'आज' : 'Today')) : dayOfWeek}
      </div>
      <div style="font-size: 0.78rem; color: var(--text-muted);">${dateObj.getDate()}/${dateObj.getMonth() + 1}</div>
      <div class="forecast-icon">${wmo.icon}</div>
      <div class="forecast-temp-max">${maxTemp}°C</div>
      <div class="forecast-temp-min">${minTemp}°C</div>
      <div class="forecast-rain-bar">
        💧 ${rainSum} mm<br>
        <span style="font-size: 0.75rem; color: #607D8B;">(${rainProb}%)</span>
      </div>
    `;
    grid.appendChild(card);
  }
}

// Friendly Error Display
function renderWeatherError(errorMsg) {
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const errBanner = document.getElementById("weather-error-banner");
  if (errBanner) {
    errBanner.style.display = "flex";
    errBanner.className = "feedback-banner error";
    errBanner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.5rem;">⚠️</span>
        <div>
          <strong>${dict.weatherError}</strong>
          <div style="font-size: 0.8rem; color: #555;">${errorMsg || "Network unreachable"}</div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="fetchLiveWeather()">
        🔄 ${dict.retryBtn}
      </button>
    `;
  }

  const statusBadge = document.getElementById("weather-status-badge");
  if (statusBadge) {
    statusBadge.className = "badge badge-danger";
    statusBadge.textContent = "Offline / Connection Error";
  }
}

// Re-render Weather on language change
function refreshWeatherLanguage() {
  initWeatherSelectors();
  fetchLiveWeather();
}

// Global hook for app.js language switcher
window.updateWeatherDisplay = refreshWeatherLanguage;

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initWeatherSelectors();
  fetchLiveWeather();
});
