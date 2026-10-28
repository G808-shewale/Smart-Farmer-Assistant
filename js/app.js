/* ==========================================================================
   Smart Farmer Assistant - Main Application Orchestrator
   Navigation, Multi-Language Engine, UI Toasts & View Switching
   ========================================================================== */

// Default Language Setup (Checks localStorage or defaults to 'mr' - Marathi for Maharashtra farmers)
const DEFAULT_LANG = "mr";
window.currentLanguage = localStorage.getItem("smart_farmer_lang") || DEFAULT_LANG;

// Toast Notification Manager
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>🌾</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Module Navigation Switcher
function showModule(moduleId) {
  // Hide all modules
  const allModules = document.querySelectorAll(".module-view");
  allModules.forEach(mod => mod.classList.remove("active"));

  // Show target module
  const target = document.getElementById(moduleId);
  if (target) {
    target.classList.add("active");
  }

  // Update navigation link active state
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.getAttribute("data-target") === moduleId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Close mobile sidebar if open
  const sidebar = document.getElementById("sidebar-nav");
  if (sidebar && window.innerWidth <= 992) {
    sidebar.classList.remove("open-mobile");
  }

  // Scroll to top of page smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Language Switcher Function
function setLanguage(lang) {
  if (!translations[lang]) return;

  window.currentLanguage = lang;
  window.currentLang = lang;
  localStorage.setItem("smart_farmer_lang", lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update all elements with data-i18n
  const translatableElements = document.querySelectorAll("[data-i18n]");
  translatableElements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key] !== undefined) {
      el.textContent = translations[lang][key];
    }
  });

  // Update placeholders
  const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
  placeholderElements.forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang] && translations[lang][key] !== undefined) {
      el.placeholder = translations[lang][key];
    }
  });

  // Update Language Header Buttons active state
  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach(btn => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update Language Settings cards active state
  const langCards = document.querySelectorAll(".lang-card");
  langCards.forEach(card => {
    if (card.getAttribute("data-lang") === lang) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });

  // Re-render modules that depend on language
  if (typeof renderTrackerUI === "function") renderTrackerUI();
  if (typeof refreshWeatherLanguage === "function") {
    refreshWeatherLanguage();
  } else if (typeof updateWeatherDisplay === "function") {
    updateWeatherDisplay();
  }
  if (typeof handleCropRecommendation === "function") handleCropRecommendation();
  if (typeof initCropComparisonSelectors === "function") initCropComparisonSelectors();
  if (typeof handleIrrigationCalculation === "function") handleIrrigationCalculation();
  if (typeof updateWeatherAwareIrrigationAlert === "function") updateWeatherAwareIrrigationAlert();
  if (typeof loadIrrigationLogs === "function") loadIrrigationLogs();
  if (typeof loadFarmTasks === "function") loadFarmTasks();
  if (typeof renderCropEncyclopedia === "function") renderCropEncyclopedia();
  if (typeof renderMarketPrices === "function") renderMarketPrices();
  if (typeof handleProfitCalculation === "function") handleProfitCalculation();
  if (window.AuthManager && typeof window.AuthManager.updateUI === "function") window.AuthManager.updateUI();

  showToast(translations[lang].changeLangSuccess);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const sidebar = document.getElementById("sidebar-nav");
  if (sidebar) {
    sidebar.classList.toggle("open-mobile");
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Set initial language from storage or default
  setLanguage(window.currentLanguage);

  // Set up navigation clicks
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetModule = link.getAttribute("data-target");
      if (targetModule) showModule(targetModule);
    });
  });

  // Mobile menu button
  const mobileBtn = document.getElementById("mobile-menu-toggle");
  if (mobileBtn) {
    mobileBtn.addEventListener("click", toggleMobileMenu);
  }
});
