/* ==========================================================================
   Smart Farmer Assistant - Authentication & Session Management (Phase 6)
   Handles secure client-side token storage, Argon2id auth flows, login/register modal,
   and dynamic UI updates with tenant-isolated API headers.
   Supports local development (port 8000/8080) and Vercel cloud deployments.
   ========================================================================== */

const AuthManager = (function() {
  const TOKEN_KEY = "smart_farmer_token";
  const USER_KEY = "smart_farmer_user";

  /**
   * Dynamically resolves the API base URL:
   * - Custom override via window.SMART_FARMER_API_BASE
   * - Production deployment (e.g. Vercel) -> same-origin relative ("")
   * - Localhost / 127.0.0.1 -> http://<host>:8000
   */
  function getApiBase() {
    if (typeof window !== "undefined" && window.SMART_FARMER_API_BASE) {
      return window.SMART_FARMER_API_BASE;
    }
    if (typeof window !== "undefined" && window.location) {
      const hostname = window.location.hostname;
      const port = window.location.port;

      // If running on port 8000 directly, use relative URL
      if (port === "8000") {
        return "";
      }
      // If deployed on Vercel or cloud (public domain, not localhost/127.0.0.1)
      if (window.location.protocol.startsWith("http") &&
          hostname !== "localhost" &&
          hostname !== "127.0.0.1" &&
          hostname !== "") {
        return "";
      }
      // If accessed via localhost on another port (e.g. 8080)
      if (hostname === "localhost") {
        return "http://localhost:8000";
      }
      if (hostname === "127.0.0.1") {
        return "http://127.0.0.1:8000";
      }
    }
    return "http://127.0.0.1:8000";
  }

  function getTranslationDict() {
    if (typeof window !== "undefined") {
      const lang = window.currentLang || window.currentLanguage || "mr";
      if (window.translations && window.translations[lang]) {
        return window.translations[lang];
      }
      if (typeof translations !== "undefined" && translations[lang]) {
        return translations[lang];
      }
    }
    return {};
  }

  /**
   * Retrieves the stored Bearer session token.
   */
  function getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch (e) {
      console.warn("localStorage unavailable:", e);
      return null;
    }
  }

  /**
   * Retrieves the cached authenticated farmer profile.
   */
  function getCurrentUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Checks if user has an active session token.
   */
  function isAuthenticated() {
    return !!getToken();
  }

  /**
   * Generates authorization headers for protected API calls.
   */
  function getAuthHeaders(extraHeaders = {}) {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...extraHeaders
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Stores auth session in localStorage.
   */
  function setSession(token, farmer) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(farmer));
    } catch (e) {
      console.error("Failed to store session:", e);
    }
    updateUI();
  }

  /**
   * Clears auth session from localStorage.
   */
  function clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error("Failed to clear session:", e);
    }
    updateUI();
  }

  /**
   * Opens the Authentication Modal in either 'login' or 'register' tab.
   */
  function openModal(tab = "login") {
    const backdrop = document.getElementById("auth-modal-backdrop");
    if (!backdrop) return;
    backdrop.classList.add("active");
    backdrop.style.display = "flex";
    switchTab(tab);
    clearErrors();
  }

  /**
   * Closes the Authentication Modal.
   */
  function closeModal() {
    const backdrop = document.getElementById("auth-modal-backdrop");
    if (!backdrop) return;
    backdrop.classList.remove("active");
    backdrop.style.display = "none";
    clearErrors();
  }

  /**
   * Switches between 'login' and 'register' tabs inside the modal.
   */
  function switchTab(tab) {
    const loginTabBtn = document.getElementById("auth-tab-btn-login");
    const regTabBtn = document.getElementById("auth-tab-btn-register");
    const loginForm = document.getElementById("auth-login-form");
    const regForm = document.getElementById("auth-register-form");

    if (tab === "register") {
      loginTabBtn?.classList.remove("active");
      regTabBtn?.classList.add("active");
      if (loginForm) loginForm.style.display = "none";
      if (regForm) regForm.style.display = "block";
    } else {
      regTabBtn?.classList.remove("active");
      loginTabBtn?.classList.add("active");
      if (regForm) regForm.style.display = "none";
      if (loginForm) loginForm.style.display = "block";
    }
    clearErrors();
  }

  /**
   * Clears error alerts inside the modal.
   */
  function clearErrors() {
    const loginErr = document.getElementById("auth-login-error");
    const regErr = document.getElementById("auth-register-error");
    if (loginErr) {
      loginErr.textContent = "";
      loginErr.style.display = "none";
    }
    if (regErr) {
      regErr.textContent = "";
      regErr.style.display = "none";
    }
  }

  /**
   * Convenient 1-Click fill for test and demo account
   */
  function fillDemoCredentials() {
    const usernameInput = document.getElementById("auth-login-username");
    const passwordInput = document.getElementById("auth-login-password");
    if (usernameInput) usernameInput.value = "suresh9876";
    if (passwordInput) passwordInput.value = "Farmer@123";
    clearErrors();
  }

  /**
   * Toggles masking/unmasking of password inputs.
   */
  function togglePassword(inputId, toggleBtn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      if (toggleBtn) toggleBtn.textContent = "🙈";
    } else {
      input.type = "password";
      if (toggleBtn) toggleBtn.textContent = "👁️";
    }
  }

  /**
   * Parses backend validation or error details cleanly for UI presentation.
   */
  function formatErrorMessage(detail, fallback) {
    if (!detail) return fallback;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map(item => {
          const field = item.loc && item.loc.length > 1 ? `${item.loc[item.loc.length - 1]}: ` : "";
          return `${field}${item.msg || JSON.stringify(item)}`;
        })
        .join("; ");
    }
    if (typeof detail === "object" && detail.msg) {
      return detail.msg;
    }
    return fallback;
  }

  /**
   * Authenticates farmer with username/mobile and password.
   */
  async function handleLogin(e) {
    if (e) e.preventDefault();
    clearErrors();

    const usernameInput = document.getElementById("auth-login-username");
    const passwordInput = document.getElementById("auth-login-password");
    const errorEl = document.getElementById("auth-login-error");
    const submitBtn = document.getElementById("auth-login-submit-btn");

    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    const t = getTranslationDict();

    if (!username || !password) {
      if (errorEl) {
        errorEl.textContent = t.authErrorRequired || "Please enter both username and password.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = t.authLoggingIn || "Logging in...";
    }

    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        const errDetail = formatErrorMessage(data.detail, t.authErrorInvalid || "Invalid username or password.");
        throw new Error(errDetail);
      }

      setSession(data.access_token, data.farmer);
      closeModal();
      showToast(t.authLoginSuccess || "Logged in successfully!");

      // Refresh application views with tenant-isolated data
      refreshAllModules();
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err.message || (t.authErrorInvalid || "Login failed. Please check credentials.");
        errorEl.style.display = "block";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = t.authLoginBtn || "Log In to Account";
      }
    }
  }

  /**
   * Registers a new farmer account with Argon2id password hashing.
   */
  async function handleRegister(e) {
    if (e) e.preventDefault();
    clearErrors();

    const fullName = document.getElementById("auth-reg-fullname")?.value.trim() || "";
    const username = document.getElementById("auth-reg-username")?.value.trim() || "";
    const password = document.getElementById("auth-reg-password")?.value || "";
    const phone = document.getElementById("auth-reg-phone")?.value.trim() || "";
    const district = document.getElementById("auth-reg-district")?.value.trim() || "Nashik";
    const acres = parseFloat(document.getElementById("auth-reg-acres")?.value) || 2.0;
    const crop = document.getElementById("auth-reg-crop")?.value.trim() || "Soybean";

    const errorEl = document.getElementById("auth-register-error");
    const submitBtn = document.getElementById("auth-register-submit-btn");
    const t = getTranslationDict();

    if (!fullName || !username || !password) {
      if (errorEl) {
        errorEl.textContent = t.authErrorRequired || "Please complete all required fields.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (password.length < 6) {
      if (errorEl) {
        errorEl.textContent = t.authRegPasswordLabel || "Password must be at least 6 characters.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = t.authRegistering || "Creating account...";
    }

    try {
      const apiBase = getApiBase();
      const payload = {
        full_name: fullName,
        username: username,
        password: password,
        phone_number: phone ? phone : null,
        district: district,
        state: "Maharashtra",
        preferred_language: window.currentLang || window.currentLanguage || "mr",
        total_acres: acres,
        primary_crop: crop
      };

      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        const errDetail = formatErrorMessage(data.detail, "Registration failed. Please check inputs.");
        throw new Error(errDetail);
      }

      setSession(data.access_token, data.farmer);
      closeModal();
      showToast(t.authRegisterSuccess || "Account registered successfully!");

      // Refresh application views with tenant-isolated data
      refreshAllModules();
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err.message || "Registration failed. Please check inputs.";
        errorEl.style.display = "block";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = t.authRegisterBtn || "Create Farmer Account";
      }
    }
  }

  /**
   * Logs out the current farmer and revokes the session on the backend.
   */
  async function handleLogout() {
    const token = getToken();
    const t = getTranslationDict();

    if (token) {
      try {
        const apiBase = getApiBase();
        await fetch(`${apiBase}/api/auth/logout`, {
          method: "POST",
          headers: getAuthHeaders()
        });
      } catch (e) {
        console.warn("Logout API call error:", e);
      }
    }

    clearSession();
    showToast(t.authLogoutSuccess || "Logged out successfully.");
    refreshAllModules();
  }

  /**
   * Verifies existing token against /api/auth/me on initial app load.
   */
  async function verifySession() {
    const token = getToken();
    if (!token) {
      updateUI();
      return;
    }

    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const farmer = await response.json();
        localStorage.setItem(USER_KEY, JSON.stringify(farmer));
        updateUI();
      } else {
        // Token expired or revoked
        clearSession();
      }
    } catch (e) {
      // Backend offline: keep local cached session so farmer can continue offline
      updateUI();
    }
  }

  /**
   * Updates navbar and UI controls to reflect login state.
   */
  function updateUI() {
    const t = getTranslationDict();
    const navAuthContainer = document.getElementById("nav-auth-container");
    const user = getCurrentUser();

    if (!navAuthContainer) return;

    if (user && isAuthenticated()) {
      navAuthContainer.innerHTML = `
        <div class="auth-pill-badge" id="auth-user-badge">
          <span class="auth-user-icon">👤</span>
          <span class="auth-user-name">${escapeHtml(user.full_name || user.username)}</span>
        </div>
        <button type="button" class="btn btn-outline btn-sm auth-logout-btn" id="btn-auth-logout" title="${t.navLogout || 'Log Out'}">
          🚪 <span data-i18n="navLogout">${t.navLogout || "Log Out"}</span>
        </button>
      `;

      const logoutBtn = document.getElementById("btn-auth-logout");
      if (logoutBtn) logoutBtn.onclick = handleLogout;
    } else {
      navAuthContainer.innerHTML = `
        <button type="button" class="btn btn-primary btn-sm auth-login-btn" id="btn-auth-login" title="${t.navLogin || 'Farmer Login'}">
          🔐 <span data-i18n="navLogin">${t.navLogin || "Farmer Login"}</span>
        </button>
      `;

      const loginBtn = document.getElementById("btn-auth-login");
      if (loginBtn) loginBtn.onclick = () => openModal("login");
    }
  }

  /**
   * Refreshes all frontend modules when auth state changes.
   */
  function refreshAllModules() {
    if (window.loadTransactions && typeof window.loadTransactions === "function") {
      window.loadTransactions();
    }
    if (window.loadIrrigationLogs && typeof window.loadIrrigationLogs === "function") {
      window.loadIrrigationLogs();
    }
    if (window.loadTasks && typeof window.loadTasks === "function") {
      window.loadTasks();
    }
    if (window.updateDashboardKPIs && typeof window.updateDashboardKPIs === "function") {
      window.updateDashboardKPIs();
    }
    if (window.renderTrackerUI && typeof window.renderTrackerUI === "function") {
      window.renderTrackerUI();
    }
  }

  /**
   * Helper: Displays feedback toast message.
   */
  function showToast(message) {
    if (window.showToast && typeof window.showToast === "function") {
      window.showToast(message);
      return;
    }
    let toast = document.getElementById("auth-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "auth-toast";
      toast.className = "auth-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return {
    getApiBase,
    getToken,
    getCurrentUser,
    isAuthenticated,
    getAuthHeaders,
    openModal,
    closeModal,
    switchTab,
    togglePassword,
    fillDemoCredentials,
    handleLogin,
    handleRegister,
    handleLogout,
    verifySession,
    updateUI,
    refreshAllModules
  };
})();

// Expose AuthManager and helper globally for all scripts and HTML event handlers
if (typeof window !== "undefined") {
  window.AuthManager = AuthManager;
  window.getApiBase = AuthManager.getApiBase;
}

// Initialize AuthManager on page load
document.addEventListener("DOMContentLoaded", function() {
  AuthManager.verifySession();
});
