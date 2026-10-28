/* ==========================================================================
   Smart Farmer Assistant - Module 1 Extension: Farm Tasks & Reminders Calendar
   Persistent task management, calendar strip, priorities & in-app alerts
   ========================================================================== */

function getTasksApiBase() {
  const base = (typeof window !== "undefined" && typeof window.getApiBase === "function")
    ? window.getApiBase()
    : "http://127.0.0.1:8000";
  return `${base}/api/tasks`;
}
const API_TASKS_BASE = {
  toString: getTasksApiBase,
  valueOf: getTasksApiBase
};
const STORAGE_KEY_PENDING_TASKS = "smart_farmer_pending_tasks";
const STORAGE_KEY_CACHED_TASKS = "smart_farmer_cached_tasks";

let currentTaskFilter = "all";
let selectedCalendarDate = null;
let isSyncingTasks = false;

// Initial fallback agricultural demo tasks
const defaultDemoTasks = [
  {
    id: "demo_t1",
    title: "Drip Irrigation & Screen Filter Flush",
    description: "Clean disc filter and run 2.5h protective watering on Soybean block",
    category: "irrigation",
    due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    priority: "high",
    status: "pending",
    is_completed: false,
    reminder_date: new Date().toISOString().split("T")[0],
    isOffline: false
  },
  {
    id: "demo_t2",
    title: "Foliar Spray 19:19:19 Soluble Fertilizer",
    description: "Mix 5g/liter for vegetative canopy boost before flower onset",
    category: "fertilizer",
    due_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    priority: "medium",
    status: "pending",
    is_completed: false,
    reminder_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    isOffline: false
  },
  {
    id: "demo_t3",
    title: "Nashik APMC Mandi Onion Rate Inquiry",
    description: "Check modal prices and arrivals for summer onion lot sale",
    category: "market",
    due_date: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    priority: "low",
    status: "pending",
    is_completed: false,
    reminder_date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    isOffline: false
  }
];

// Offline Queue Helpers
function getPendingTasks() {
  const stored = localStorage.getItem(STORAGE_KEY_PENDING_TASKS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading pending tasks:", e);
    }
  }
  return [];
}

function savePendingTasks(list) {
  localStorage.setItem(STORAGE_KEY_PENDING_TASKS, JSON.stringify(list));
}

// Category Icon Mapping
function getCategoryIcon(cat) {
  const map = {
    sowing: "🌱",
    irrigation: "💧",
    fertilizer: "🧪",
    spraying: "🛡️",
    harvest: "🌾",
    market: "📈",
    maintenance: "🔧",
    other: "📋"
  };
  return map[cat] || "📋";
}

// 1. Load Farm Tasks from Server or Local Offline Queue
async function loadFarmTasks() {
  const container = document.getElementById("dash-tasks-container");
  if (!container) return;

  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  let serverTasks = [];
  const pendingTasks = getPendingTasks().map(t => ({ ...t, isOffline: true }));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const headers = window.AuthManager ? window.AuthManager.getAuthHeaders() : {};
    const res = await fetch(API_TASKS_BASE, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      serverTasks = await res.json();
      localStorage.setItem(STORAGE_KEY_CACHED_TASKS, JSON.stringify(serverTasks));
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    // Backend offline: read cached tasks
    const cached = localStorage.getItem(STORAGE_KEY_CACHED_TASKS);
    if (cached) {
      try {
        serverTasks = JSON.parse(cached);
      } catch (e) {
        serverTasks = [...defaultDemoTasks];
      }
    } else {
      serverTasks = [...defaultDemoTasks];
    }
  }

  // Combine: pending offline tasks first, then server tasks
  const combined = [...pendingTasks, ...serverTasks.map(t => ({ ...t, isOffline: false }))];

  // Update KPI counters on Dashboard
  const pendingCount = combined.filter(t => !t.is_completed).length;
  const kpiTasksElem = document.getElementById("dash-kpi-tasks");
  const badgeElem = document.getElementById("dash-tasks-badge");

  if (kpiTasksElem) kpiTasksElem.textContent = pendingCount;
  if (badgeElem) {
    badgeElem.textContent = `${pendingCount} ${lang === "mr" ? "कामे बाकी" : (lang === "hi" ? "कार्य लंबित" : "Tasks")}`;
    badgeElem.className = pendingCount > 0 ? "badge badge-warning" : "badge badge-success";
  }

  // Render 7-day calendar strip
  renderCalendarStrip(combined);

  // Render Tasks List
  renderFarmTasksList(combined);

  // Check In-App Reminders & Browser Notifications
  checkTaskReminders(combined);
}

// 2. Render 7-Day Interactive Calendar Strip
function renderCalendarStrip(allTasks) {
  const strip = document.getElementById("task-calendar-strip");
  if (!strip) return;

  const lang = window.currentLanguage || "en";
  const today = new Date();
  strip.innerHTML = "";

  const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNamesMr = ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"];
  const dayNamesHi = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
  const dayLabels = (lang === "mr") ? dayNamesMr : ((lang === "hi") ? dayNamesHi : dayNamesEn);

  for (let i = -1; i < 6; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const isToday = (i === 0);
    const isSelected = (selectedCalendarDate === dateStr);

    // Count tasks on this date
    const tasksOnDay = allTasks.filter(t => t.due_date === dateStr);
    const hasPending = tasksOnDay.some(t => !t.is_completed);

    const dayCard = document.createElement("div");
    dayCard.className = `cal-day-cell ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`;
    dayCard.onclick = () => selectCalendarDate(dateStr === selectedCalendarDate ? null : dateStr);

    dayCard.innerHTML = `
      <div class="cal-day-name">${dayLabels[d.getDay()]}</div>
      <div class="cal-day-num">${d.getDate()}</div>
      <div class="cal-day-dots">
        ${tasksOnDay.length > 0 ? `<span class="cal-dot ${hasPending ? 'dot-pending' : 'dot-done'}"></span>` : ''}
      </div>
    `;

    strip.appendChild(dayCard);
  }
}

function selectCalendarDate(dateStr) {
  selectedCalendarDate = dateStr;
  loadFarmTasks();
}

// 3. Render Tasks List with Filtering
function renderFarmTasksList(allTasks) {
  const container = document.getElementById("dash-tasks-container");
  if (!container) return;

  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;
  const todayStr = new Date().toISOString().split("T")[0];

  // Apply Filter
  let filtered = allTasks;
  if (selectedCalendarDate) {
    filtered = filtered.filter(t => t.due_date === selectedCalendarDate);
  }

  if (currentTaskFilter === "pending") {
    filtered = filtered.filter(t => !t.is_completed);
  } else if (currentTaskFilter === "high") {
    filtered = filtered.filter(t => t.priority === "high" && !t.is_completed);
  } else if (currentTaskFilter === "completed") {
    filtered = filtered.filter(t => t.is_completed);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 28px 16px; color: var(--text-muted);">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">📅</div>
        <p style="margin: 0; font-size: 0.95rem;">${dict.noTasksFound}</p>
      </div>
    `;
    return;
  }

  let html = "";
  filtered.forEach(task => {
    const isDone = task.is_completed === true;
    const isOffline = task.isOffline === true;
    const catIcon = getCategoryIcon(task.category);

    // Priority badge
    let priorityBadge = "";
    if (task.priority === "high") {
      priorityBadge = `<span class="badge badge-danger">${dict.priorityHigh}</span>`;
    } else if (task.priority === "medium") {
      priorityBadge = `<span class="badge badge-warning">${dict.priorityMedium}</span>`;
    } else {
      priorityBadge = `<span class="badge badge-info">${dict.priorityLow}</span>`;
    }

    // Due Date Tag
    let dueTag = "";
    if (!isDone) {
      if (task.due_date < todayStr) {
        dueTag = `<span class="badge badge-danger">⚠️ ${dict.taskOverdue}</span>`;
      } else if (task.due_date === todayStr) {
        dueTag = `<span class="badge badge-danger">🔴 ${dict.taskDueToday}</span>`;
      } else {
        dueTag = `<span class="task-date-tag">📅 ${task.due_date}</span>`;
      }
    } else {
      dueTag = `<span class="badge badge-success">✅ ${dict.taskStatusCompleted}</span>`;
    }

    // Reminder tag
    const reminderTag = (task.reminder_date && !isDone)
      ? `<span class="task-reminder-chip" title="${dict.reminderNoticeText}: ${task.reminder_date}">🔔 ${task.reminder_date}</span>`
      : "";

    // Cloud vs Offline status
    const syncBadge = isOffline
      ? `<span class="badge-offline" style="font-size: 0.72rem;">🟠 Offline</span>`
      : "";

    html += `
      <div class="task-card-item ${isDone ? 'completed-task' : ''}">
        <div class="task-card-left">
          <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''} 
            onchange="toggleTaskStatus('${task.id}', ${isOffline})" 
            aria-label="Mark task complete">
        </div>
        <div class="task-card-body">
          <div class="task-card-title-row">
            <span class="task-cat-icon">${catIcon}</span>
            <strong class="task-title-text ${isDone ? 'strike-text' : ''}">${task.title}</strong>
            ${syncBadge}
          </div>
          ${task.description ? `<p class="task-desc-text">${task.description}</p>` : ''}
          <div class="task-card-meta">
            ${dueTag}
            ${priorityBadge}
            ${reminderTag}
          </div>
        </div>
        <div class="task-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="openTaskModal('${task.id}')" title="Edit" style="padding: 4px 8px;">
            ✏️
          </button>
          <button class="btn btn-secondary btn-sm" onclick="deleteFarmTask('${task.id}', ${isOffline})" title="Delete" style="padding: 4px 8px; color: var(--danger-red);">
            🗑️
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// 4. Toggle Task Completion Status
async function toggleTaskStatus(taskId, isOffline) {
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  if (!isOffline && !String(taskId).startsWith("demo_")) {
    try {
      const headers = window.AuthManager ? window.AuthManager.getAuthHeaders() : {};
      const res = await fetch(`${API_TASKS_BASE}/${taskId}/toggle`, { method: "PATCH", headers });
      if (res.ok) {
        showToast(dict.taskToggleSuccess);
        await loadFarmTasks();
        return;
      }
    } catch (e) {
      console.warn("Backend toggle failed, toggling locally:", e);
    }
  }

  // Fallback for offline or demo tasks
  let pending = getPendingTasks();
  let found = false;
  pending = pending.map(t => {
    if (String(t.id) === String(taskId)) {
      found = true;
      const nextDone = !t.is_completed;
      return { ...t, is_completed: nextDone, status: nextDone ? "completed" : "pending" };
    }
    return t;
  });
  if (found) {
    savePendingTasks(pending);
  } else {
    // Update in cached
    let cached = localStorage.getItem(STORAGE_KEY_CACHED_TASKS);
    if (cached) {
      try {
        let list = JSON.parse(cached);
        list = list.map(t => {
          if (String(t.id) === String(taskId)) {
            const nextDone = !t.is_completed;
            return { ...t, is_completed: nextDone, status: nextDone ? "completed" : "pending" };
          }
          return t;
        });
        localStorage.setItem(STORAGE_KEY_CACHED_TASKS, JSON.stringify(list));
      } catch (e) {}
    }
  }

  showToast(dict.taskToggleSuccess);
  await loadFarmTasks();
}

// 5. Open & Close Task Modal
function openTaskModal(taskId) {
  const modal = document.getElementById("task-modal-backdrop");
  if (!modal) return;

  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;
  const form = document.getElementById("task-modal-form");
  const modalTitle = document.getElementById("task-modal-header-title");

  form.reset();
  document.getElementById("task-edit-id").value = "";

  if (taskId) {
    // Editing an existing task
    modalTitle.textContent = dict.editTaskTitle;
    let task = null;

    // Search in pending
    task = getPendingTasks().find(t => String(t.id) === String(taskId));
    if (!task) {
      const cached = localStorage.getItem(STORAGE_KEY_CACHED_TASKS);
      if (cached) {
        try {
          task = JSON.parse(cached).find(t => String(t.id) === String(taskId));
        } catch (e) {}
      }
    }
    if (!task) {
      task = defaultDemoTasks.find(t => String(t.id) === String(taskId));
    }

    if (task) {
      document.getElementById("task-edit-id").value = task.id;
      document.getElementById("task-input-title").value = task.title;
      document.getElementById("task-input-category").value = task.category || "other";
      document.getElementById("task-input-due-date").value = task.due_date;
      document.getElementById("task-input-priority").value = task.priority || "medium";
      document.getElementById("task-input-reminder").value = task.reminder_date || "";
      document.getElementById("task-input-desc").value = task.description || "";
    }
  } else {
    // Adding a new task
    modalTitle.textContent = dict.addTaskBtn;
    document.getElementById("task-input-due-date").value = new Date().toISOString().split("T")[0];
  }

  modal.classList.add("active");
}

function closeTaskModal() {
  const modal = document.getElementById("task-modal-backdrop");
  if (modal) modal.classList.remove("active");
}

// 6. Save (Create or Update) Task
async function handleSaveFarmTask(event) {
  if (event) event.preventDefault();
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  const saveBtn = document.getElementById("btn-save-task");
  const editId = document.getElementById("task-edit-id").value;
  const title = document.getElementById("task-input-title").value.trim();
  const category = document.getElementById("task-input-category").value;
  const dueDate = document.getElementById("task-input-due-date").value;
  const priority = document.getElementById("task-input-priority").value;
  const reminder = document.getElementById("task-input-reminder").value || null;
  const desc = document.getElementById("task-input-desc").value.trim() || null;

  if (title.length < 2) {
    alert("Please enter a task title with at least 2 characters.");
    return;
  }
  if (!dueDate) {
    alert("Please select a due date.");
    return;
  }

  // Prevent duplicate submissions by disabling button
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "⏳ Saving...";
  }

  const payload = {
    title,
    description: desc,
    category,
    due_date: dueDate,
    priority,
    status: "pending",
    reminder_date: reminder
  };

  try {
    const isEdit = Boolean(editId && !editId.startsWith("offline_") && !editId.startsWith("demo_"));
    const url = isEdit ? `${API_TASKS_BASE}/${editId}` : API_TASKS_BASE;
    const method = isEdit ? "PUT" : "POST";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const headers = window.AuthManager ? window.AuthManager.getAuthHeaders() : { "Content-Type": "application/json" };
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      closeTaskModal();
      showToast(dict.taskSaveSuccess);
      await loadFarmTasks();
      return;
    } else if (response.status === 409) {
      alert(dict.duplicateTaskNotice);
      return;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err) {
    console.warn("Backend unavailable, saving task locally in offline queue:", err);
    let pending = getPendingTasks();
    if (editId) {
      pending = pending.map(t => String(t.id) === String(editId) ? { ...t, ...payload } : t);
    } else {
      pending.unshift({
        ...payload,
        id: `offline_t_${Date.now()}`,
        is_completed: false
      });
    }
    savePendingTasks(pending);
    closeTaskModal();
    showToast(dict.taskSaveSuccess);
    await loadFarmTasks();
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = dict.saveTaskBtn;
    }
  }
}

// 7. Delete Task
async function deleteFarmTask(taskId, isOffline) {
  const lang = window.currentLanguage || "en";
  const dict = translations[lang] || translations.en;

  if (!confirm(dict.deleteConfirmTask)) return;

  if (!isOffline && !String(taskId).startsWith("demo_")) {
    try {
      const headers = window.AuthManager ? window.AuthManager.getAuthHeaders() : {};
      const res = await fetch(`${API_TASKS_BASE}/${taskId}`, { method: "DELETE", headers });
      if (res.ok) {
        showToast(dict.taskDeleteSuccess);
        await loadFarmTasks();
        return;
      }
    } catch (e) {
      console.warn("Backend delete failed, removing locally:", e);
    }
  }

  // Remove from pending
  let pending = getPendingTasks();
  pending = pending.filter(t => String(t.id) !== String(taskId));
  savePendingTasks(pending);

  // Remove from cached
  let cachedStr = localStorage.getItem(STORAGE_KEY_CACHED_TASKS);
  if (cachedStr) {
    try {
      let cached = JSON.parse(cachedStr);
      cached = cached.filter(t => String(t.id) !== String(taskId));
      localStorage.setItem(STORAGE_KEY_CACHED_TASKS, JSON.stringify(cached));
    } catch (e) {}
  }

  showToast(dict.taskDeleteSuccess);
  await loadFarmTasks();
}

// 8. Filter Tasks by Status
function setTaskFilter(filterType) {
  currentTaskFilter = filterType;
  const buttons = document.querySelectorAll(".task-filter-btn");
  buttons.forEach(btn => {
    if (btn.getAttribute("data-filter") === filterType) {
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-secondary");
    } else {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-secondary");
    }
  });

  loadFarmTasks();
}

// 9. In-App Reminders & Browser Notification Check
function checkTaskReminders(allTasks) {
  const todayStr = new Date().toISOString().split("T")[0];
  const dueTodayTasks = allTasks.filter(t => !t.is_completed && (t.due_date === todayStr || t.reminder_date === todayStr));

  const alertContainer = document.getElementById("dash-task-alert-banner");
  if (!alertContainer) return;

  if (dueTodayTasks.length > 0) {
    const lang = window.currentLanguage || "en";
    const dict = translations[lang] || translations.en;
    const firstTask = dueTodayTasks[0];

    alertContainer.style.display = "flex";
    alertContainer.innerHTML = `
      <div style="font-size: 1.4rem;">🔔</div>
      <div style="flex: 1;">
        <strong>${dict.taskDueToday}: ${firstTask.title}</strong>
        <div style="font-size: 0.84rem; opacity: 0.9;">${firstTask.description || ''}</div>
      </div>
    `;

    // Attempt browser Web Notification if permitted
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Smart Farmer Reminder", {
          body: `Due Today: ${firstTask.title}`,
          icon: "favicon.ico"
        });
      } catch (e) {}
    }
  } else {
    alertContainer.style.display = "none";
  }
}

// Request Browser Notifications Permission if supported
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

// Global hooks for app.js and HTML bindings
window.loadFarmTasks = loadFarmTasks;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.handleSaveFarmTask = handleSaveFarmTask;
window.toggleTaskStatus = toggleTaskStatus;
window.deleteFarmTask = deleteFarmTask;
window.setTaskFilter = setTaskFilter;
window.selectCalendarDate = selectCalendarDate;
window.requestNotificationPermission = requestNotificationPermission;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-modal-form");
  if (taskForm) {
    taskForm.addEventListener("submit", handleSaveFarmTask);
  }
  loadFarmTasks();
});
