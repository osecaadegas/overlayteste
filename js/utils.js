// ==================== UTILITIES MODULE ====================

// Simple debounce function to prevent rapid function calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format currency values
function formatCurrency(amount, currency = '€') {
  if (typeof amount !== 'number') return `${currency}0.00`;
  return `${currency}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// Format multiplier values
function formatMultiplier(multiplier) {
  if (typeof multiplier !== 'number') return '0.00x';
  return `${multiplier.toFixed(2)}x`;
}

// Get slot image with fallback
function getSlotImage(slotName, fallback = 'https://i.imgur.com/8E3ucNx.png') {
  if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
    const slot = window.slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
    return slot && slot.image ? slot.image : fallback;
  }
  return fallback;
}

// Generate unique ID
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Make panel draggable and resizable
function makePanelInteractive(panel) {
  if (!panel || panel.dataset.interactive) return;
  panel.dataset.interactive = 'true';

  // Add drag handle to panel title
  const title = panel.querySelector('.middle-panel-title, .tournament-control-header, .customization-header');
  if (title) {
    title.style.cursor = 'move';
    title.style.userSelect = 'none';
    
    let isDragging = false;
    let offsetX, offsetY;

    title.addEventListener('mousedown', (e) => {
      if (window.isLayoutLocked) return;
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      panel.style.position = 'fixed';
      panel.style.zIndex = '1000';
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging && !window.isLayoutLocked) {
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
        panel.style.transform = 'none';
        panel.style.margin = '0';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // Add resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  resizeHandle.style.cssText = `
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: nwse-resize;
    background: linear-gradient(135deg, transparent 50%, rgba(255, 215, 0, 0.5) 50%);
    border-bottom-right-radius: 8px;
  `;
  panel.style.position = 'fixed';
  panel.style.resize = 'none';
  panel.appendChild(resizeHandle);

  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  resizeHandle.addEventListener('mousedown', (e) => {
    if (window.isLayoutLocked) return;
    e.stopPropagation();
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = panel.offsetWidth;
    startHeight = panel.offsetHeight;
  });

  document.addEventListener('mousemove', (e) => {
    if (isResizing && !window.isLayoutLocked) {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);
      panel.style.width = Math.max(300, newWidth) + 'px';
      panel.style.height = Math.max(200, newHeight) + 'px';
      panel.style.maxWidth = 'none';
      panel.style.maxHeight = 'none';
    }
  });

  document.addEventListener('mouseup', () => {
    isResizing = false;
  });
}

// Local storage helpers
const StorageHelper = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Animation helpers
const AnimationHelper = {
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  },

  fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.max(initialOpacity - (progress / duration), 0);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
      }
    }
    
    requestAnimationFrame(animate);
  },

  slideUp(element, duration = 300) {
    const height = element.offsetHeight;
    element.style.height = height + 'px';
    element.style.overflow = 'hidden';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newHeight = Math.max(height - (height * progress / duration), 0);
      
      element.style.height = newHeight + 'px';
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
      }
    }
    
    requestAnimationFrame(animate);
  },

  slideDown(element, duration = 300) {
    element.style.display = 'block';
    const height = element.scrollHeight;
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newHeight = Math.min(height * progress / duration, height);
      
      element.style.height = newHeight + 'px';
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.height = '';
        element.style.overflow = '';
      }
    }
    
    requestAnimationFrame(animate);
  }
};

// Event emitter for inter-module communication
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

// Global event emitter instance
window.eventEmitter = new EventEmitter();

// Notification system
const NotificationManager = {
  show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add to container or create one
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }

    container.appendChild(notification);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, duration);
    }

    return notification;
  },

  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  },

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  },

  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  },

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
};

// Modal system
const ModalManager = {
  show(content, options = {}) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">${options.title || 'Modal'}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-content">
          ${content}
        </div>
        ${options.showFooter ? `
          <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button class="modal-btn modal-btn-primary" onclick="this.closest('.modal-overlay').remove()">OK</button>
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(modal);

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    return modal;
  },

  confirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
      const modal = this.show(`<p>${message}</p>`, {
        title,
        showFooter: false
      });

      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      footer.innerHTML = `
        <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="modal-btn modal-btn-primary confirm-btn">Confirm</button>
      `;

      modal.querySelector('.modal-container').appendChild(footer);

      footer.querySelector('.confirm-btn').addEventListener('click', () => {
        modal.remove();
        resolve(true);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-btn-secondary')) {
          modal.remove();
          resolve(false);
        }
      });
    });
  }
};

// Validation helpers
const Validator = {
  isEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  isNumber(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  isPositiveNumber(value) {
    return this.isNumber(value) && parseFloat(value) > 0;
  },

  isInRange(value, min, max) {
    const num = parseFloat(value);
    return this.isNumber(value) && num >= min && num <= max;
  },

  minLength(value, length) {
    return value && value.length >= length;
  },

  maxLength(value, length) {
    return value && value.length <= length;
  }
};

// Customization Manager
const CustomizationManager = {
  init() {
    this.loadSavedSettings();
    this.setupEventListeners();
  },

  setupEventListeners() {
    // All color pickers
    const allColorInputs = [
      'primary-color', 'accent-color', 'background-color', 'text-color',
      'streamer-name-color', 'website-color', 'gamble-aware-color',
      'slot-title-color', 'slot-bet-color', 'slot-win-color', 
      'bonus-header-color', 'money-display-color',
      'slot-gradient-start', 'slot-gradient-end',
      'button-gradient-start', 'button-gradient-end',
      'sidebar-gradient-start', 'sidebar-gradient-end'
    ];

    allColorInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => this.applyAllColors());
      }
    });

    // Gradient direction
    const gradientDirection = document.getElementById('gradient-direction');
    if (gradientDirection) {
      gradientDirection.addEventListener('change', () => this.applyAllColors());
    }

    // Effect toggles
    const effectToggles = [
      'glass-effect-toggle',
      'animated-gradients-toggle',
      'glow-effects-toggle',
      'sidebar-backgrounds-toggle'
    ];

    effectToggles.forEach(id => {
      const toggle = document.getElementById(id);
      if (toggle) {
        toggle.addEventListener('change', () => this.applyEffects());
      }
    });

    // Streamer name
    const streamerNameInput = document.getElementById('custom-streamer-name');
    if (streamerNameInput) {
      streamerNameInput.addEventListener('input', () => {
        const streamerName = document.getElementById('streamer-name');
        if (streamerName) {
          streamerName.textContent = streamerNameInput.value || 'Streamer Name';
        }
        this.saveSettings();
      });
    }

    // Website URL
    const websiteUrlInput = document.getElementById('custom-website-url');
    if (websiteUrlInput) {
      websiteUrlInput.addEventListener('input', () => {
        const websiteLink = document.getElementById('website-link');
        if (websiteLink) {
          websiteLink.textContent = websiteUrlInput.value || 'www.yourwebsite.com';
          websiteLink.href = websiteUrlInput.value || '#';
        }
        this.saveSettings();
      });
    }

    // Logo upload
    const logoBtn = document.getElementById('custom-logo-btn');
    const logoFile = document.getElementById('custom-logo-file');
    const resetLogoBtn = document.getElementById('reset-logo-btn');
    
    if (logoBtn && logoFile) {
      logoBtn.addEventListener('click', () => logoFile.click());
      logoFile.addEventListener('change', (e) => this.handleLogoUpload(e));
    }
    
    if (resetLogoBtn) {
      resetLogoBtn.addEventListener('click', () => this.resetLogo());
    }

    // Background settings
    const bgType = document.getElementById('background-type');
    if (bgType) {
      bgType.addEventListener('change', () => this.handleBackgroundType());
    }

    const bgBtn = document.getElementById('custom-bg-btn');
    const bgFile = document.getElementById('custom-bg-file');
    const resetBgBtn = document.getElementById('reset-bg-btn');
    
    if (bgBtn && bgFile) {
      bgBtn.addEventListener('click', () => bgFile.click());
      bgFile.addEventListener('change', (e) => this.handleBackgroundUpload(e));
    }
    
    if (resetBgBtn) {
      resetBgBtn.addEventListener('click', () => this.resetBackground());
    }

    // Ad image input (sidebar art button)
    const adImageInput = document.getElementById('ad-image-input');
    if (adImageInput) {
      adImageInput.addEventListener('change', (e) => this.handleBackgroundUpload(e));
    }

    // Theme presets
    const themePresets = document.querySelectorAll('.theme-preset');
    themePresets.forEach(btn => {
      btn.addEventListener('click', () => this.applyTheme(btn.dataset.theme));
    });

    // Background pattern selector
    const applyPatternBtn = document.getElementById('apply-background-pattern');
    if (applyPatternBtn) {
      applyPatternBtn.addEventListener('click', () => this.applyBackgroundPattern());
    }

    // Apply and Reset buttons
    const applyBtn = document.getElementById('apply-customization');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.applyAllColors();
        this.applyEffects();
      });
    }

    const resetAllBtn = document.getElementById('reset-all-btn');
    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', () => this.resetAll());
    }
  },

  applyAllColors() {
    // Basic colors
    const primaryColor = document.getElementById('primary-color')?.value || '#9346ff';
    const accentColor = document.getElementById('accent-color')?.value || '#00e1ff';
    const backgroundColor = document.getElementById('background-color')?.value || '#1a1b2e';
    const textColor = document.getElementById('text-color')?.value || '#ffffff';

    // Gradients
    const slotStart = document.getElementById('slot-gradient-start')?.value || '#9346ff';
    const slotEnd = document.getElementById('slot-gradient-end')?.value || '#00e1ff';
    const buttonStart = document.getElementById('button-gradient-start')?.value || '#9346ff';
    const buttonEnd = document.getElementById('button-gradient-end')?.value || '#7c3aed';
    const sidebarStart = document.getElementById('sidebar-gradient-start')?.value || '#1a1b2e';
    const sidebarEnd = document.getElementById('sidebar-gradient-end')?.value || '#16213e';
    const direction = document.getElementById('gradient-direction')?.value || '135deg';

    // Apply to CSS variables
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--slot-gradient-start', slotStart);
    document.documentElement.style.setProperty('--slot-gradient-end', slotEnd);
    document.documentElement.style.setProperty('--button-gradient-start', buttonStart);
    document.documentElement.style.setProperty('--button-gradient-end', buttonEnd);
    document.documentElement.style.setProperty('--sidebar-gradient-start', sidebarStart);
    document.documentElement.style.setProperty('--sidebar-gradient-end', sidebarEnd);
    document.documentElement.style.setProperty('--gradient-direction', direction);

    // Apply colors directly to ALL elements across the entire overlay
    
    // 1. SIDEBAR - Buttons and background
    const sidebarBtns = document.querySelectorAll('.sidebar-btn, .middle-btn, .sidebar-main-btn');
    sidebarBtns.forEach(btn => {
      btn.style.background = `linear-gradient(${direction}, ${buttonStart}, ${buttonEnd})`;
      btn.style.borderColor = accentColor;
    });

    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.background = `linear-gradient(${direction}, ${sidebarStart}, ${sidebarEnd})`;
      sidebar.style.boxShadow = `0 8px 32px 0 ${accentColor}33, 0 1.5px 0 0 ${accentColor} inset`;
    }

    // 2. ALL PANELS - Info panel, Middle panels, Tournament panels
    const allPanels = document.querySelectorAll('.info-panel, .middle-panel, #random-slot-panel, #tournament-panel, #tournament-control-panel, #bonus-opening-panel');
    allPanels.forEach(panel => {
      panel.style.background = `linear-gradient(${direction}, ${sidebarStart}, ${sidebarEnd})`;
      panel.style.boxShadow = `0 8px 32px 0 ${accentColor}33, 0 1.5px 0 0 ${accentColor} inset`;
      panel.style.borderColor = accentColor;
    });

    // 3. TITLES AND HEADERS - All cyan/accent colored text
    const accentElements = document.querySelectorAll('.middle-panel-title, .panel-subtitle, h4, .bracket-title-row h4, .bonus-list-header h4, .tournament-bracket-header h4, .info-section h4, .bh-stat-value');
    accentElements.forEach(el => {
      el.style.color = accentColor;
      el.style.textShadow = `0 1px 8px ${accentColor}80`;
    });

    // 4. BUTTONS - Action buttons across the overlay
    const actionButtons = document.querySelectorAll('.middle-btn, .tournament-action-btn, .bracket-control-btn, button[type="button"], .custom-apply-btn');
    actionButtons.forEach(btn => {
      btn.style.background = `linear-gradient(${direction}, ${buttonStart}, ${buttonEnd})`;
      btn.style.borderColor = primaryColor;
    });

    // 5. INPUTS AND SELECTS
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="url"], select, textarea, .middle-input');
    inputs.forEach(input => {
      input.style.borderColor = accentColor;
      input.style.background = `rgba(0, 0, 0, 0.3)`;
      input.style.color = textColor;
    });

    // 6. STATS BAR
    const statsBar = document.querySelector('.bh-stats-bar');
    if (statsBar) {
      statsBar.style.background = `linear-gradient(${direction}, ${sidebarStart}99, ${sidebarEnd}99)`;
      statsBar.style.borderColor = accentColor;
    }

    const statItems = document.querySelectorAll('.bh-stat-item');
    statItems.forEach(item => {
      item.style.background = `${sidebarStart}cc`;
      item.style.borderColor = `${accentColor}33`;
    });

    // 7. BONUS CARDS
    const bonusCards = document.querySelectorAll('.bonus-card, .bonus-content');
    bonusCards.forEach(card => {
      card.style.background = `linear-gradient(${direction}, ${slotStart}22, ${slotEnd}22)`;
      card.style.borderColor = `${accentColor}44`;
    });

    // 8. TOURNAMENT MATCHES
    const matches = document.querySelectorAll('.bracket-match-horizontal, .match-participant');
    matches.forEach(match => {
      match.style.borderColor = `${accentColor}66`;
      match.style.background = `rgba(0, 0, 0, 0.3)`;
    });

    // 9. NAVBAR
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.background = `linear-gradient(${direction}, ${sidebarStart}, ${sidebarEnd})`;
      navbar.style.borderBottomColor = accentColor;
    }

    // 10. SLOT CARDS (if any are rendered)
    const slotCards = document.querySelectorAll('.slot-card, .participant-card');
    slotCards.forEach(card => {
      card.style.background = `linear-gradient(${direction}, ${slotStart}, ${slotEnd})`;
      card.style.borderColor = primaryColor;
    });

    // 11. SPECIFIC TEXT COLORS
    const streamerNameColor = document.getElementById('streamer-name-color')?.value;
    if (streamerNameColor) {
      const streamerName = document.getElementById('streamer-name');
      if (streamerName) streamerName.style.color = streamerNameColor;
    }

    const websiteColor = document.getElementById('website-color')?.value;
    if (websiteColor) {
      const websiteLink = document.getElementById('website-link');
      if (websiteLink) websiteLink.style.color = websiteColor;
    }

    const gambleAwareColor = document.getElementById('gamble-aware-color')?.value;
    if (gambleAwareColor) {
      const gambleAware = document.querySelector('.gamble-aware');
      if (gambleAware) gambleAware.style.color = gambleAwareColor;
    }

    const slotTitleColor = document.getElementById('slot-title-color')?.value;
    if (slotTitleColor) {
      const titles = document.querySelectorAll('.slot-name, .participant-name, .bonus-name');
      titles.forEach(el => el.style.color = slotTitleColor);
    }

    const slotBetColor = document.getElementById('slot-bet-color')?.value;
    if (slotBetColor) {
      const bets = document.querySelectorAll('.slot-bet, .bonus-bet, .bonus-metrics');
      bets.forEach(el => el.style.color = slotBetColor);
    }

    const slotWinColor = document.getElementById('slot-win-color')?.value;
    if (slotWinColor) {
      const wins = document.querySelectorAll('.slot-multiplier, .profit-positive');
      wins.forEach(el => el.style.color = slotWinColor);
    }

    const bonusHeaderColor = document.getElementById('bonus-header-color')?.value;
    if (bonusHeaderColor) {
      const headers = document.querySelectorAll('.bonus-list-header h4, .panel-subtitle');
      headers.forEach(el => el.style.color = bonusHeaderColor);
    }

    const moneyDisplayColor = document.getElementById('money-display-color')?.value;
    if (moneyDisplayColor) {
      const moneyDisplays = document.querySelectorAll('.bh-stat-value, #total-bet, #total-payout, #total-profit');
      moneyDisplays.forEach(el => el.style.color = moneyDisplayColor);
    }

    // 12. SCROLLBARS (WebKit browsers) + Override ALL hardcoded colors
    const existingStyle = document.getElementById('theme-override-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'theme-override-styles';
    style.innerHTML = `
      /* Scrollbars */
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(${direction}, ${primaryColor}, ${accentColor}) !important;
      }
      ::-webkit-scrollbar-track {
        background: ${backgroundColor}44 !important;
      }
      
      /* Override all hardcoded colors in customization panel */
      .customization-header h2 {
        color: ${accentColor} !important;
      }
      
      .customization-section h3 {
        color: ${primaryColor} !important;
      }
      
      .customization-row label,
      .customization-row input,
      .customization-row select {
        color: ${textColor} !important;
        border-color: ${accentColor} !important;
      }
      
      .tab-btn {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      
      .tab-btn:hover {
        color: ${textColor} !important;
      }
      
      .tab-btn.active {
        color: ${accentColor} !important;
        border-bottom-color: ${accentColor} !important;
      }
      
      .theme-preset {
        color: ${textColor} !important;
      }
      
      .theme-preset:hover, .theme-preset.active {
        border-color: ${accentColor} !important;
      }
      
      /* Navbar */
      .navbar {
        background: linear-gradient(${direction}, ${sidebarStart}, ${sidebarEnd}) !important;
        border-bottom: 2px solid ${accentColor} !important;
      }
      
      /* Streamer Name Plate */
      .streamer-name, .osecaadegas95-name {
        background: linear-gradient(135deg, ${primaryColor}33, ${accentColor}33) !important;
        padding: 6px 16px !important;
        border-radius: 20px !important;
        border: 2px solid ${accentColor} !important;
        color: ${textColor} !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px ${accentColor}44 !important;
        backdrop-filter: blur(10px) !important;
      }
      
      /* Website Button/Link */
      .navbar-website-btn {
        background: linear-gradient(135deg, ${slotStart}, ${slotEnd}) !important;
        padding: 6px 16px !important;
        border-radius: 20px !important;
        border: 2px solid ${primaryColor} !important;
        color: ${textColor} !important;
        text-decoration: none !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px ${primaryColor}44 !important;
        transition: all 0.3s ease !important;
      }
      
      .navbar-website-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 16px ${primaryColor}66 !important;
        border-color: ${accentColor} !important;
      }
      
      .website-btn-icon {
        color: ${accentColor} !important;
      }
      
      #website-text {
        color: ${textColor} !important;
      }
      
      /* Be Gamble Aware Link */
      .aware-link {
        background: linear-gradient(135deg, ${buttonStart}, ${buttonEnd}) !important;
        padding: 6px 16px !important;
        border-radius: 20px !important;
        border: 2px solid ${accentColor} !important;
        color: ${textColor} !important;
        text-decoration: none !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px ${accentColor}44 !important;
        transition: all 0.3s ease !important;
      }
      
      .aware-link:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 16px ${accentColor}66 !important;
        background: linear-gradient(135deg, ${buttonEnd}, ${buttonStart}) !important;
      }
      
      /* Override inline styles */
      #streamer-name-input,
      #website-input {
        background: rgba(0,0,0,0.7) !important;
        color: ${textColor} !important;
        border: 1px solid ${accentColor} !important;
      }
      
      /* BH Panel title */
      .middle-panel-title {
        color: ${accentColor} !important;
      }
      
      /* All text colors */
      body, .customization-panel, .customization-content {
        color: ${textColor} !important;
      }
      
      /* Input placeholders */
      ::placeholder {
        color: ${textColor}99 !important;
      }
      
      /* Bonus list */
      .bonus-list-header {
        background: linear-gradient(135deg, ${primaryColor}22, ${accentColor}22) !important;
        border-bottom: 2px solid ${accentColor} !important;
        backdrop-filter: blur(10px) !important;
      }
      
      .bonus-list-header h4 {
        color: ${accentColor} !important;
        text-shadow: 0 2px 8px ${accentColor}66 !important;
      }
      
      .bonus-list {
        background: linear-gradient(${direction}, ${sidebarStart}dd, ${sidebarEnd}dd) !important;
        border: 2px solid ${accentColor}44 !important;
        backdrop-filter: blur(10px) !important;
      }
      
      .bonus-list li {
        background: linear-gradient(135deg, ${slotStart}11, ${slotEnd}11) !important;
        border: 1px solid ${accentColor}33 !important;
        transition: all 0.3s ease !important;
      }
      
      .bonus-list li:hover {
        background: linear-gradient(135deg, ${slotStart}22, ${slotEnd}22) !important;
        border-color: ${accentColor}66 !important;
        transform: translateX(4px) !important;
        box-shadow: 0 4px 12px ${accentColor}44 !important;
      }
      
      .bonus-list li.opened {
        background: linear-gradient(135deg, ${primaryColor}22, ${accentColor}22) !important;
        border-color: ${accentColor} !important;
      }
      
      .bonus-name {
        color: ${textColor} !important;
        font-weight: 600 !important;
      }
      
      .bonus-bet, .bonus-payout {
        color: ${textColor}cc !important;
      }
      
      .bonus-multiplier {
        color: ${accentColor} !important;
        font-weight: 700 !important;
      }
      
      .profit-positive {
        color: #10b981 !important;
      }
      
      .profit-negative {
        color: #ef4444 !important;
      }
      
      /* Tournament elements */
      .tournament-bracket-header h4,
      .bracket-title-row h4 {
        color: ${accentColor} !important;
      }
      
      /* Stats bar labels */
      .bh-stat-label {
        color: ${textColor}cc !important;
      }
    `;
    document.head.appendChild(style);

    this.saveSettings();
  },

  applyEffects() {
    const glassEffect = document.getElementById('glass-effect-toggle')?.checked || false;
    const animatedGradients = document.getElementById('animated-gradients-toggle')?.checked || false;
    const glowEffects = document.getElementById('glow-effects-toggle')?.checked || false;
    const sidebarBg = document.getElementById('sidebar-backgrounds-toggle')?.checked || false;

    document.body.classList.toggle('glass-effect', glassEffect);
    document.body.classList.toggle('animated-gradients', animatedGradients);
    document.body.classList.toggle('glow-effects', glowEffects);
    document.body.classList.toggle('custom-theme', !sidebarBg);

    this.saveSettings();
  },

  handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoImg = document.getElementById('navbar-logo');
        if (logoImg) {
          logoImg.src = event.target.result;
        }
        StorageHelper.set('customLogo', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  },

  resetLogo() {
    const logoImg = document.getElementById('navbar-logo');
    if (logoImg) {
      logoImg.src = 'https://i.imgur.com/bfVjDYT.png';
    }
    StorageHelper.remove('customLogo');
  },

  handleBackgroundType() {
    const bgType = document.getElementById('background-type')?.value;
    const gradientControls = document.getElementById('gradient-controls');
    const imageControls = document.getElementById('image-controls');

    if (gradientControls) gradientControls.style.display = bgType === 'gradient' ? 'flex' : 'none';
    if (imageControls) imageControls.style.display = bgType === 'image' ? 'flex' : 'none';

    this.saveSettings();
  },

  handleBackgroundUpload(e) {
    // This function has been moved to script-new.js
    // Image/video uploads are now handled by the main app
    console.warn('handleBackgroundUpload called from utils.js - this is deprecated');
  },

  resetBackground() {
    document.body.style.backgroundImage = '';
    document.body.classList.remove('custom-background');
    StorageHelper.remove('customBackground');
  },

  applyBackgroundPattern() {
    const patternSelect = document.getElementById('background-pattern-select');
    if (!patternSelect) return;

    const pattern = patternSelect.value;
    const backgroundColor = document.getElementById('background-color')?.value || '#1a1b2e';

    const patterns = {
      'none': `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor} 100%)`,
      'radial-purple': 'radial-gradient(circle at 20% 50%, rgba(147, 70, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 225, 255, 0.15) 0%, transparent 50%)',
      'stripe-purple': 'repeating-linear-gradient(45deg, #1e1b4b 0px, #1e1b4b 40px, #312e81 40px, #312e81 80px)',
      'grid-blue': 'linear-gradient(0deg, #1e3a8a 0%, #1e40af 100%), repeating-linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0px, transparent 1px, transparent 40px, rgba(59, 130, 246, 0.1) 41px)',
      'radial-green': 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 60%), linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
      'circle-red': 'repeating-radial-gradient(circle at 0 0, transparent 0, #7f1d1d 40px), repeating-linear-gradient(#991b1b55, #991b1b)',
      'solid-dark': 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
      'stripe-gold': 'repeating-linear-gradient(45deg, #1c1917 0px, #1c1917 20px, #292524 20px, #292524 40px), radial-gradient(circle at 70% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
      'diamond-grey': 'linear-gradient(135deg, #374151 25%, transparent 25%), linear-gradient(225deg, #374151 25%, transparent 25%), linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(315deg, #1f2937 25%, #374151 25%)',
      'radial-black-red': 'radial-gradient(circle at 30% 30%, rgba(127, 29, 29, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(220, 38, 38, 0.2) 0%, transparent 50%), linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
      'horizontal-chrome': 'linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%), repeating-linear-gradient(0deg, transparent 0px, rgba(229, 231, 235, 0.05) 1px, transparent 2px, transparent 40px)',
      'line-neon-blue': 'repeating-linear-gradient(0deg, #0c4a6e 0px, #0c4a6e 2px, #075985 2px, #075985 4px), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
      'radial-neon-pink': 'radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.2) 0%, transparent 50%), linear-gradient(135deg, #831843 0%, #9f1239 100%)',
      'stripe-neon-green': 'repeating-linear-gradient(45deg, #064e3b 0px, #064e3b 40px, #065f46 40px, #065f46 80px), radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
      'rainbow-gradient': 'linear-gradient(45deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(6, 182, 212, 0.1) 50%, rgba(16, 185, 129, 0.1) 75%, rgba(249, 115, 22, 0.1) 100%), linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
      'black-sky': 'radial-gradient(ellipse at top, rgba(31, 41, 55, 0.4) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(17, 24, 39, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(75, 85, 99, 0.1) 0%, transparent 30%), radial-gradient(circle at 80% 80%, rgba(55, 65, 81, 0.1) 0%, transparent 30%), linear-gradient(180deg, #000000 0%, #050505 50%, #000000 100%)'
    };

    const selectedPattern = patterns[pattern] || patterns['none'];
    document.body.style.background = selectedPattern;
    document.body.style.backgroundColor = backgroundColor;
    
    this.saveSettings();
  },

  applyTheme(theme) {
    const themes = {
      default: {
        primary: '#9346ff', accent: '#00e1ff', background: '#1a1b2e', text: '#ffffff',
        slotStart: '#9346ff', slotEnd: '#00e1ff',
        buttonStart: '#9346ff', buttonEnd: '#7c3aed',
        sidebarStart: '#1a1b2e', sidebarEnd: '#16213e',
        bgPattern: 'radial-gradient(circle at 20% 50%, rgba(147, 70, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 225, 255, 0.15) 0%, transparent 50%)'
      },
      purple: {
        primary: '#a855f7', accent: '#c084fc', background: '#1e1b4b', text: '#ffffff',
        slotStart: '#a855f7', slotEnd: '#c084fc',
        buttonStart: '#a855f7', buttonEnd: '#9333ea',
        sidebarStart: '#1e1b4b', sidebarEnd: '#312e81',
        bgPattern: 'repeating-linear-gradient(45deg, #1e1b4b 0px, #1e1b4b 40px, #312e81 40px, #312e81 80px)'
      },
      blue: {
        primary: '#3b82f6', accent: '#60a5fa', background: '#1e3a8a', text: '#ffffff',
        slotStart: '#3b82f6', slotEnd: '#60a5fa',
        buttonStart: '#3b82f6', buttonEnd: '#2563eb',
        sidebarStart: '#1e3a8a', sidebarEnd: '#1e40af',
        bgPattern: 'linear-gradient(0deg, #1e3a8a 0%, #1e40af 100%), repeating-linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0px, transparent 1px, transparent 40px, rgba(59, 130, 246, 0.1) 41px)'
      },
      green: {
        primary: '#10b981', accent: '#34d399', background: '#064e3b', text: '#ffffff',
        slotStart: '#10b981', slotEnd: '#34d399',
        buttonStart: '#10b981', buttonEnd: '#059669',
        sidebarStart: '#064e3b', sidebarEnd: '#065f46',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 60%), linear-gradient(180deg, #064e3b 0%, #065f46 100%)'
      },
      red: {
        primary: '#ef4444', accent: '#f87171', background: '#7f1d1d', text: '#ffffff',
        slotStart: '#ef4444', slotEnd: '#f87171',
        buttonStart: '#ef4444', buttonEnd: '#dc2626',
        sidebarStart: '#7f1d1d', sidebarEnd: '#991b1b',
        bgPattern: 'repeating-radial-gradient(circle at 0 0, transparent 0, #7f1d1d 40px), repeating-linear-gradient(#991b1b55, #991b1b)'
      },
      dark: {
        primary: '#6b7280', accent: '#9ca3af', background: '#111827', text: '#ffffff',
        slotStart: '#6b7280', slotEnd: '#9ca3af',
        buttonStart: '#6b7280', buttonEnd: '#4b5563',
        sidebarStart: '#111827', sidebarEnd: '#1f2937',
        bgPattern: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)'
      },
      // HEAVY THEMES
      gold: {
        primary: '#fbbf24', accent: '#fcd34d', background: '#1c1917', text: '#fef3c7',
        slotStart: '#d97706', slotEnd: '#fbbf24',
        buttonStart: '#b45309', buttonEnd: '#d97706',
        sidebarStart: '#292524', sidebarEnd: '#1c1917',
        bgPattern: 'repeating-linear-gradient(45deg, #1c1917 0px, #1c1917 20px, #292524 20px, #292524 40px), radial-gradient(circle at 70% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)'
      },
      'grey-red': {
        primary: '#dc2626', accent: '#ef4444', background: '#374151', text: '#f3f4f6',
        slotStart: '#6b7280', slotEnd: '#dc2626',
        buttonStart: '#991b1b', buttonEnd: '#dc2626',
        sidebarStart: '#374151', sidebarEnd: '#1f2937',
        bgPattern: 'linear-gradient(135deg, #374151 25%, transparent 25%), linear-gradient(225deg, #374151 25%, transparent 25%), linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(315deg, #1f2937 25%, #374151 25%)'
      },
      'black-red': {
        primary: '#dc2626', accent: '#f87171', background: '#000000', text: '#ffffff',
        slotStart: '#7f1d1d', slotEnd: '#dc2626',
        buttonStart: '#450a0a', buttonEnd: '#991b1b',
        sidebarStart: '#0a0a0a', sidebarEnd: '#000000',
        bgPattern: 'radial-gradient(circle at 30% 30%, rgba(127, 29, 29, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(220, 38, 38, 0.2) 0%, transparent 50%), linear-gradient(180deg, #000000 0%, #0a0a0a 100%)'
      },
      chrome: {
        primary: '#e5e7eb', accent: '#f3f4f6', background: '#1f2937', text: '#ffffff',
        slotStart: '#9ca3af', slotEnd: '#d1d5db',
        buttonStart: '#6b7280', buttonEnd: '#9ca3af',
        sidebarStart: '#374151', sidebarEnd: '#1f2937',
        bgPattern: 'linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%), repeating-linear-gradient(0deg, transparent 0px, rgba(229, 231, 235, 0.05) 1px, transparent 2px, transparent 40px)'
      },
      'neon-blue': {
        primary: '#06b6d4', accent: '#22d3ee', background: '#0c4a6e', text: '#e0f2fe',
        slotStart: '#0284c7', slotEnd: '#06b6d4',
        buttonStart: '#0369a1', buttonEnd: '#0891b2',
        sidebarStart: '#0c4a6e', sidebarEnd: '#075985',
        bgPattern: 'repeating-linear-gradient(0deg, #0c4a6e 0px, #0c4a6e 2px, #075985 2px, #075985 4px), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)'
      },
      'neon-pink': {
        primary: '#ec4899', accent: '#f472b6', background: '#831843', text: '#fce7f3',
        slotStart: '#db2777', slotEnd: '#ec4899',
        buttonStart: '#9f1239', buttonEnd: '#db2777',
        sidebarStart: '#831843', sidebarEnd: '#9f1239',
        bgPattern: 'radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.2) 0%, transparent 50%), linear-gradient(135deg, #831843 0%, #9f1239 100%)'
      },
      'neon-green': {
        primary: '#10b981', accent: '#34d399', background: '#064e3b', text: '#d1fae5',
        slotStart: '#059669', slotEnd: '#10b981',
        buttonStart: '#047857', buttonEnd: '#059669',
        sidebarStart: '#064e3b', sidebarEnd: '#065f46',
        bgPattern: 'repeating-linear-gradient(45deg, #064e3b 0px, #064e3b 40px, #065f46 40px, #065f46 80px), radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 70%)'
      },
      rainbow: {
        primary: '#f472b6', accent: '#a78bfa', background: '#1e1b4b', text: '#ffffff',
        slotStart: '#ec4899', slotEnd: '#8b5cf6',
        buttonStart: '#f97316', buttonEnd: '#ec4899',
        sidebarStart: '#1e1b4b', sidebarEnd: '#312e81',
        bgPattern: 'linear-gradient(45deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(6, 182, 212, 0.1) 50%, rgba(16, 185, 129, 0.1) 75%, rgba(249, 115, 22, 0.1) 100%), linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)'
      },
      'black-sky': {
        primary: '#4b5563', accent: '#6b7280', background: '#000000', text: '#e5e7eb',
        slotStart: '#1f2937', slotEnd: '#374151',
        buttonStart: '#111827', buttonEnd: '#1f2937',
        sidebarStart: '#000000', sidebarEnd: '#0a0a0a',
        bgPattern: 'radial-gradient(ellipse at top, rgba(31, 41, 55, 0.4) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(17, 24, 39, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(75, 85, 99, 0.1) 0%, transparent 30%), radial-gradient(circle at 80% 80%, rgba(55, 65, 81, 0.1) 0%, transparent 30%), linear-gradient(180deg, #000000 0%, #050505 50%, #000000 100%)'
      }
    };

    const selectedTheme = themes[theme];
    if (selectedTheme) {
      document.getElementById('primary-color').value = selectedTheme.primary;
      document.getElementById('accent-color').value = selectedTheme.accent;
      document.getElementById('background-color').value = selectedTheme.background;
      document.getElementById('text-color').value = selectedTheme.text;
      document.getElementById('slot-gradient-start').value = selectedTheme.slotStart;
      document.getElementById('slot-gradient-end').value = selectedTheme.slotEnd;
      document.getElementById('button-gradient-start').value = selectedTheme.buttonStart;
      document.getElementById('button-gradient-end').value = selectedTheme.buttonEnd;
      document.getElementById('sidebar-gradient-start').value = selectedTheme.sidebarStart;
      document.getElementById('sidebar-gradient-end').value = selectedTheme.sidebarEnd;
      
      // Apply background pattern
      if (selectedTheme.bgPattern) {
        document.body.style.background = selectedTheme.bgPattern;
        document.body.style.backgroundColor = selectedTheme.background;
      }
      
      this.applyAllColors();
    }
  },

  resetAll() {
    StorageHelper.remove('customization');
    StorageHelper.remove('customLogo');
    StorageHelper.remove('customBackground');
    location.reload();
  },

  saveSettings() {
    const settings = {
      // Colors
      primaryColor: document.getElementById('primary-color')?.value,
      accentColor: document.getElementById('accent-color')?.value,
      backgroundColor: document.getElementById('background-color')?.value,
      textColor: document.getElementById('text-color')?.value,
      streamerNameColor: document.getElementById('streamer-name-color')?.value,
      websiteColor: document.getElementById('website-color')?.value,
      // Gradients
      slotGradientStart: document.getElementById('slot-gradient-start')?.value,
      slotGradientEnd: document.getElementById('slot-gradient-end')?.value,
      buttonGradientStart: document.getElementById('button-gradient-start')?.value,
      buttonGradientEnd: document.getElementById('button-gradient-end')?.value,
      sidebarGradientStart: document.getElementById('sidebar-gradient-start')?.value,
      sidebarGradientEnd: document.getElementById('sidebar-gradient-end')?.value,
      gradientDirection: document.getElementById('gradient-direction')?.value,
      // Effects
      glassEffect: document.getElementById('glass-effect-toggle')?.checked,
      animatedGradients: document.getElementById('animated-gradients-toggle')?.checked,
      glowEffects: document.getElementById('glow-effects-toggle')?.checked,
      sidebarBackgrounds: document.getElementById('sidebar-backgrounds-toggle')?.checked,
      // General
      streamerName: document.getElementById('custom-streamer-name')?.value,
      websiteUrl: document.getElementById('custom-website-url')?.value,
      backgroundType: document.getElementById('background-type')?.value
    };

    StorageHelper.set('customization', settings);
  },

  loadSavedSettings() {
    const settings = StorageHelper.get('customization');
    if (!settings) return;

    // Load colors
    if (settings.primaryColor) document.getElementById('primary-color').value = settings.primaryColor;
    if (settings.accentColor) document.getElementById('accent-color').value = settings.accentColor;
    if (settings.backgroundColor) document.getElementById('background-color').value = settings.backgroundColor;
    if (settings.textColor) document.getElementById('text-color').value = settings.textColor;
    if (settings.streamerNameColor) document.getElementById('streamer-name-color').value = settings.streamerNameColor;
    if (settings.websiteColor) document.getElementById('website-color').value = settings.websiteColor;
    
    // Load gradients
    if (settings.slotGradientStart) document.getElementById('slot-gradient-start').value = settings.slotGradientStart;
    if (settings.slotGradientEnd) document.getElementById('slot-gradient-end').value = settings.slotGradientEnd;
    if (settings.buttonGradientStart) document.getElementById('button-gradient-start').value = settings.buttonGradientStart;
    if (settings.buttonGradientEnd) document.getElementById('button-gradient-end').value = settings.buttonGradientEnd;
    if (settings.sidebarGradientStart) document.getElementById('sidebar-gradient-start').value = settings.sidebarGradientStart;
    if (settings.sidebarGradientEnd) document.getElementById('sidebar-gradient-end').value = settings.sidebarGradientEnd;
    if (settings.gradientDirection) document.getElementById('gradient-direction').value = settings.gradientDirection;

    // Load effects
    if (settings.glassEffect !== undefined) document.getElementById('glass-effect-toggle').checked = settings.glassEffect;
    if (settings.animatedGradients !== undefined) document.getElementById('animated-gradients-toggle').checked = settings.animatedGradients;
    if (settings.glowEffects !== undefined) document.getElementById('glow-effects-toggle').checked = settings.glowEffects;
    if (settings.sidebarBackgrounds !== undefined) document.getElementById('sidebar-backgrounds-toggle').checked = settings.sidebarBackgrounds;

    // Load general
    if (settings.streamerName) {
      document.getElementById('custom-streamer-name').value = settings.streamerName;
      const streamerName = document.getElementById('streamer-name');
      if (streamerName) streamerName.textContent = settings.streamerName;
    }
    if (settings.websiteUrl) {
      document.getElementById('custom-website-url').value = settings.websiteUrl;
      const websiteLink = document.getElementById('website-link');
      if (websiteLink) {
        websiteLink.textContent = settings.websiteUrl;
        websiteLink.href = settings.websiteUrl;
      }
    }
    if (settings.backgroundType) {
      document.getElementById('background-type').value = settings.backgroundType;
      this.handleBackgroundType();
    }

    // Load custom logo
    const customLogo = StorageHelper.get('customLogo');
    if (customLogo) {
      const logoImg = document.getElementById('navbar-logo');
      if (logoImg) logoImg.src = customLogo;
    }

    // Load custom background
    const customBackground = StorageHelper.get('customBackground');
    if (customBackground) {
      document.body.style.backgroundImage = `url(${customBackground})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.classList.add('custom-background');
    }

    // Apply loaded settings
    this.applyAllColors();
    this.applyEffects();
  }
};

// Initialize customization on page load
document.addEventListener('DOMContentLoaded', () => {
  CustomizationManager.init();
});

// Export utilities to global scope
window.debounce = debounce;
window.formatCurrency = formatCurrency;
window.formatMultiplier = formatMultiplier;
window.getSlotImage = getSlotImage;
window.generateId = generateId;
window.StorageHelper = StorageHelper;
window.AnimationHelper = AnimationHelper;
window.NotificationManager = NotificationManager;
window.ModalManager = ModalManager;
window.Validator = Validator;
window.CustomizationManager = CustomizationManager;