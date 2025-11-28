// ==================== BONUS HUNT MODULE ====================

class BonusHuntManager {
  constructor() {
    this.bonuses = [];
    this.totalBet = 0;
    this.totalPayout = 0;
    this.customSlotImages = {}; // Store custom image URLs
    this.currentBonusOpeningIndex = 0; // Track current bonus in opening panel
    this.init();
  }

  init() {
    console.log('Bonus Hunt Manager initialized');
    this.setupEventListeners();
    // Don't load saved bonuses - start fresh on each page load
  }

  setupEventListeners() {
    // Add bonus button
    const addBonusBtn = document.getElementById('add-bonus-btn');
    if (addBonusBtn) {
      addBonusBtn.addEventListener('click', () => this.addBonus());
    }

    // Slot name input with suggestions
    const slotNameInput = document.getElementById('slot-name-input');
    if (slotNameInput) {
      slotNameInput.addEventListener('input', () => this.handleSlotNameInput());
      slotNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addBonus();
        }
      });
    }

    // Bet size input
    const betSizeInput = document.getElementById('bet-size-input');
    if (betSizeInput) {
      betSizeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addBonus();
        }
      });
    }

    // Super checkbox
    const superCheckbox = document.getElementById('super-checkbox');
    if (superCheckbox) {
      superCheckbox.addEventListener('change', () => this.handleSuperCheckbox());
    }

    // Clear all bonuses
    const clearAllBtn = document.getElementById('clear-all-bonuses');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => this.clearAllBonuses());
    }

    // Export bonuses
    const exportBtn = document.getElementById('export-bonuses');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportBonuses());
    }

    // Bonus opening button
    const bonusOpeningBtn = document.getElementById('bonus-opening-btn');
    if (bonusOpeningBtn) {
      bonusOpeningBtn.addEventListener('click', () => this.showBonusOpeningPanel());
    }

    // Close bonus opening panel
    const closeBonusOpeningBtn = document.getElementById('close-bonus-opening-btn');
    if (closeBonusOpeningBtn) {
      closeBonusOpeningBtn.addEventListener('click', () => this.hideBonusOpeningPanel());
    }

    // Keyboard navigation for bonus opening panel
    document.addEventListener('keydown', (e) => {
      const bonusOpeningPanel = document.getElementById('bonus-opening-panel');
      if (bonusOpeningPanel && bonusOpeningPanel.style.display !== 'none') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.navigateToPreviousBonus();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.navigateToNextBonus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.hideBonusOpeningPanel();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          // Move to next bonus after entering payout
          this.navigateToNextBonus();
        }
      }
    });

    // Start money and stop money inputs for stats bar
    const startMoneyInput = document.getElementById('start-money-input');
    const stopMoneyInput = document.getElementById('stop-money-input');
    if (startMoneyInput) {
      startMoneyInput.addEventListener('input', () => this.updateStatsBar());
    }
    if (stopMoneyInput) {
      stopMoneyInput.addEventListener('input', () => this.updateStatsBar());
    }

    // Actual balance input
    const actualBalanceInput = document.getElementById('actual-balance-input');
    if (actualBalanceInput) {
      actualBalanceInput.addEventListener('input', () => this.updateStatsBar());
    }

    // Slot image URL button
    const slotImgUrlBtn = document.getElementById('slot-img-url-btn');
    if (slotImgUrlBtn) {
      slotImgUrlBtn.addEventListener('click', () => this.toggleSlotImageUrlInput());
    }

    // Slot image URL input
    const slotImgUrlInput = document.getElementById('slot-img-url-input');
    if (slotImgUrlInput) {
      slotImgUrlInput.addEventListener('blur', () => this.saveCustomSlotImage());
      slotImgUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.saveCustomSlotImage();
        }
      });
    }

    // Add slot button (+Slot button)
    const addSlotBtn = document.getElementById('add-slot-btn');
    if (addSlotBtn) {
      addSlotBtn.addEventListener('click', () => this.addBonus());
    }

  }

  handleSlotNameInput() {
    const slotNameInput = document.getElementById('slot-name-input');
    const suggestionBox = document.querySelector('.slot-suggestion-box');
    
    if (!slotNameInput || !suggestionBox) return;

    const value = slotNameInput.value.trim();
    if (value.length < 3) {
      suggestionBox.style.display = 'none';
      return;
    }

    let matches = [];
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      matches = window.slotDatabase
        .filter(slot => slot.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
    }

    if (matches.length === 0) {
      suggestionBox.style.display = 'none';
      return;
    }

    suggestionBox.innerHTML = '';
    matches.forEach(slot => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.innerHTML = `
        <img src="${slot.image}" alt="${slot.name}" class="suggestion-image">
        <div class="suggestion-info">
          <div class="suggestion-name">${slot.name}</div>
          <div class="suggestion-provider">${slot.provider}</div>
        </div>
      `;
      
      item.addEventListener('click', () => {
        slotNameInput.value = slot.name;
        suggestionBox.style.display = 'none';
        this.showSelectedSlot(slot);
        
        const betSizeInput = document.getElementById('bet-size-input');
        if (betSizeInput) {
          setTimeout(() => betSizeInput.focus(), 100);
        }
      });
      
      suggestionBox.appendChild(item);
    });

    suggestionBox.style.display = 'block';
  }

  showSelectedSlot(slot) {
    const selectedSlotDisplay = document.querySelector('.selected-slot-display');
    if (selectedSlotDisplay) {
      selectedSlotDisplay.innerHTML = `
        <div class="selected-slot-content">
          <img src="${slot.image}" alt="${slot.name}" class="selected-slot-image">
          <div class="selected-slot-info">
            <div class="selected-slot-name">${slot.name}</div>
            <div class="selected-slot-provider">${slot.provider}</div>
          </div>
        </div>
      `;
      selectedSlotDisplay.style.display = 'block';
    }
  }

  hideSelectedSlot() {
    const selectedSlotDisplay = document.querySelector('.selected-slot-display');
    if (selectedSlotDisplay) {
      selectedSlotDisplay.style.display = 'none';
    }
  }

  toggleSlotImageUrlInput() {
    const slotImgUrlRow = document.getElementById('slot-img-url-row');
    const slotImgUrlInput = document.getElementById('slot-img-url-input');
    const slotNameInput = document.getElementById('slot-name-input');
    
    if (!slotImgUrlRow || !slotImgUrlInput) return;
    
    const slotName = slotNameInput ? slotNameInput.value.trim() : '';
    
    if (slotImgUrlRow.style.display === 'none') {
      slotImgUrlRow.style.display = 'block';
      // Pre-fill with existing custom image if available
      if (slotName && this.customSlotImages[slotName.toLowerCase()]) {
        slotImgUrlInput.value = this.customSlotImages[slotName.toLowerCase()];
      }
      slotImgUrlInput.focus();
    } else {
      slotImgUrlRow.style.display = 'none';
      slotImgUrlInput.value = '';
    }
  }

  saveCustomSlotImage() {
    const slotNameInput = document.getElementById('slot-name-input');
    const slotImgUrlInput = document.getElementById('slot-img-url-input');
    const slotImgUrlRow = document.getElementById('slot-img-url-row');
    
    if (!slotNameInput || !slotImgUrlInput) return;
    
    const slotName = slotNameInput.value.trim();
    const imageUrl = slotImgUrlInput.value.trim();
    
    if (!slotName) {
      this.showFeedback('Please enter a slot name first', 'error');
      return;
    }
    
    if (imageUrl) {
      this.customSlotImages[slotName.toLowerCase()] = imageUrl;
      this.showFeedback(`Custom image saved for ${slotName}`, 'success');
    } else {
      // Remove custom image if URL is empty
      delete this.customSlotImages[slotName.toLowerCase()];
    }
    
    // Save custom images to localStorage
    this.saveBonuses();
    
    // Hide the input row
    if (slotImgUrlRow) {
      slotImgUrlRow.style.display = 'none';
    }
  }

  handleSuperCheckbox() {
    const superCheckbox = document.getElementById('super-checkbox');
    const slotNameInput = document.getElementById('slot-name-input');
    
    if (superCheckbox && superCheckbox.checked && slotNameInput) {
      slotNameInput.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
      slotNameInput.style.color = '#000';
      slotNameInput.setAttribute('placeholder', 'SUPER BONUS - Enter slot name');
    } else if (slotNameInput) {
      slotNameInput.style.background = '';
      slotNameInput.style.color = '';
      slotNameInput.setAttribute('placeholder', 'Enter slot name');
    }
  }

  addBonus() {
    const slotNameInput = document.getElementById('slot-name-input');
    const betSizeInput = document.getElementById('bet-size-input');
    const superCheckbox = document.getElementById('super-checkbox');
    
    if (!slotNameInput || !betSizeInput) return;

    const slotName = slotNameInput.value.trim();
    const betSize = parseFloat(betSizeInput.value);

    if (!slotName || !betSize || betSize <= 0) {
      this.showFeedback('Please enter valid slot name and bet size', 'error');
      return;
    }

    const bonus = {
      id: Date.now(),
      slot: slotName,
      bet: betSize,
      payout: null,
      multiplier: 0,
      isSuper: superCheckbox ? superCheckbox.checked : false,
      timestamp: new Date().toISOString()
    };

    this.bonuses.push(bonus);
    this.updateTotals();
    this.renderBonusList();
    this.saveBonuses();

    // Clear inputs
    slotNameInput.value = '';
    betSizeInput.value = '';
    if (superCheckbox) superCheckbox.checked = false;
    this.handleSuperCheckbox();
    this.hideSelectedSlot();

    slotNameInput.focus();
    this.showFeedback(`Added ${slotName} - €${betSize.toFixed(2)}`, 'success');
  }

  getSlotImage(slotName) {
    // First check if there's a custom image URL
    if (this.customSlotImages[slotName.toLowerCase()]) {
      return this.customSlotImages[slotName.toLowerCase()];
    }
    
    // Then check the slot database
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      const slot = window.slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
      return slot ? slot.image : 'https://i.imgur.com/8E3ucNx.png';
    }
    return 'https://i.imgur.com/8E3ucNx.png';
  }

  renderBonusList() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;

    bonusListUl.innerHTML = '';

    this.bonuses.forEach(bonus => {
      const li = document.createElement('li');
      li.className = `bonus-item${bonus.isSuper ? ' super-slot' : ''}`;
      li.dataset.bonusId = bonus.id;
      
      const slotImage = this.getSlotImage(bonus.slot);
      
      li.innerHTML = `
        <div class="bonus-content">
          <img src="${slotImage}" alt="${bonus.slot}" class="bonus-slot-image">
          <div class="bonus-info-section">
            <div class="bonus-slot-name">${bonus.slot}</div>
            <div class="bonus-metrics">
              <div class="metric-item">
                <div class="metric-value">€${bonus.bet.toFixed(2)}</div>
                <div class="metric-label">BET</div>
              </div>
              <div class="metric-item">
                <div class="metric-value payout-value ${bonus.payout !== null ? 'completed' : 'pending'}">
                  ${bonus.payout !== null ? '€' + bonus.payout.toFixed(2) : '--'}
                </div>
                <div class="metric-label">WIN</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">${bonus.multiplier.toFixed(2)}x</div>
                <div class="metric-label">MULT</div>
              </div>
            </div>
          </div>

        </div>
      `;

      // Add click handler to toggle super status
      li.addEventListener('click', () => {
        this.toggleSuperStatus(bonus.id);
      });

      bonusListUl.appendChild(li);
    });

    this.updateBonusListCarousel();
  }

  updateBonusListCarousel() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;

    // Remove existing clones first
    const existingClones = bonusListUl.querySelectorAll('.bonus-item-clone');
    existingClones.forEach(clone => clone.remove());

    if (this.bonuses.length > 2) {
      // Get original items (not clones)
      const originalItems = Array.from(bonusListUl.querySelectorAll('.bonus-item:not(.bonus-item-clone)'));
      
      // Clone all items twice for seamless infinite loop
      const firstCloneSet = originalItems.map(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('bonus-item-clone');
        return clone;
      });
      
      const secondCloneSet = originalItems.map(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('bonus-item-clone');
        return clone;
      });
      
      // Append both clone sets
      firstCloneSet.forEach(clone => bonusListUl.appendChild(clone));
      secondCloneSet.forEach(clone => bonusListUl.appendChild(clone));
      
      bonusListUl.classList.add('carousel-active');
      
      // Calculate animation duration based on number of items
      const itemCount = originalItems.length;
      const duration = itemCount * 3; // 3 seconds per item
      bonusListUl.style.animationDuration = `${duration}s`;
    } else {
      bonusListUl.classList.remove('carousel-active');
      bonusListUl.style.animationDuration = '';
    }
  }

  toggleSuperStatus(bonusId) {
    const bonus = this.bonuses.find(b => b.id === bonusId);
    if (bonus) {
      bonus.isSuper = !bonus.isSuper;
      this.renderBonusList();
      this.showFeedback(bonus.isSuper ? 'Super bonus activated!' : 'Super bonus deactivated', bonus.isSuper ? 'success' : 'info');
    }
  }

  showBonusOpeningPanel() {
    const middlePanel = document.getElementById('middle-panel');
    const bonusOpeningPanel = document.getElementById('bonus-opening-panel');
    
    if (this.bonuses.length === 0) {
      this.showFeedback('No bonuses to open! Add bonuses first.', 'error');
      return;
    }

    // Reset to first bonus when opening panel
    this.currentBonusOpeningIndex = 0;

    if (middlePanel) middlePanel.style.display = 'none';
    if (bonusOpeningPanel) {
      bonusOpeningPanel.style.display = 'flex';
      this.makeBonusOpeningPanelDraggable(bonusOpeningPanel);
      this.renderBonusOpeningList();
    }
  }

  hideBonusOpeningPanel() {
    const middlePanel = document.getElementById('middle-panel');
    const bonusOpeningPanel = document.getElementById('bonus-opening-panel');
    
    if (middlePanel) middlePanel.style.display = 'flex';
    if (bonusOpeningPanel) bonusOpeningPanel.style.display = 'none';
  }

  renderBonusOpeningList() {
    const bonusOpeningList = document.getElementById('bonus-opening-list');
    if (!bonusOpeningList) return;

    // Ensure current index is valid
    if (this.currentBonusOpeningIndex >= this.bonuses.length) {
      this.currentBonusOpeningIndex = 0;
    }

    if (this.bonuses.length === 0) return;

    const bonus = this.bonuses[this.currentBonusOpeningIndex];
    const slotImage = this.getSlotImage(bonus.slot);
    
    bonusOpeningList.innerHTML = `
      <div class="bonus-opening-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 10px;">
        <button class="bonus-nav-btn" id="prev-bonus-btn" ${this.bonuses.length <= 1 ? 'style="visibility: hidden;"' : ''} style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; color: white; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 14px;">
          ← Previous
        </button>
        <div class="bonus-counter" style="color: #ffffff; font-size: 14px; font-weight: 700; text-shadow: 0 0 10px rgba(255,255,255,0.5);">
          ${this.currentBonusOpeningIndex + 1} of ${this.bonuses.length}
        </div>
        <button class="bonus-nav-btn" id="next-bonus-btn" ${this.bonuses.length <= 1 ? 'style="visibility: hidden;"' : ''} style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; color: white; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 14px;">
          Next →
        </button>
      </div>
      
      <div class="bonus-opening-item" style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <div class="bonus-slot-display" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <img src="${slotImage}" alt="${bonus.slot}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #ffd700; box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);">
          <div style="text-align: center;">
            <div style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 2px;">${bonus.slot}</div>
            <div style="font-size: 13px; color: #00e1ff; font-weight: 600;">Bet: €${bonus.bet.toFixed(2)}</div>
          </div>
        </div>
        <div class="payout-input-section" style="display: flex; align-items: center; gap: 8px;">
          <input type="number" 
                 class="payout-input" 
                 placeholder="Enter payout" 
                 value="${bonus.payout !== null ? bonus.payout : ''}"
                 min="0" 
                 step="0.01"
                 data-bonus-id="${bonus.id}"
                 style="width: 160px; padding: 8px 12px; font-size: 16px; font-weight: 600; background: rgba(255,255,255,0.1); border: 2px solid #00e1ff; border-radius: 6px; color: #ffffff; text-align: center;">
          <span style="color: #9ca3af; font-size: 16px; font-weight: 600;">€</span>
        </div>
      </div>
    `;

    // Set up navigation event listeners
    const prevBtn = document.getElementById('prev-bonus-btn');
    const nextBtn = document.getElementById('next-bonus-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateToPreviousBonus());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateToNextBonus());
      nextBtn.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
      });
      nextBtn.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
      });
      prevBtn.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      });
    }

    // Set up payout input listener
    const payoutInput = bonusOpeningList.querySelector('.payout-input');
    if (payoutInput) {
      payoutInput.addEventListener('input', (e) => {
        this.updateBonusPayout(bonus.id, parseFloat(e.target.value) || 0);
      });
      
      // Auto-focus and select text for easier input
      setTimeout(() => {
        payoutInput.focus();
        payoutInput.select();
      }, 100);
    }
  }

  navigateToNextBonus() {
    if (this.bonuses.length <= 1) return;
    
    this.currentBonusOpeningIndex = (this.currentBonusOpeningIndex + 1) % this.bonuses.length;
    this.renderBonusOpeningList();
  }

  navigateToPreviousBonus() {
    if (this.bonuses.length <= 1) return;
    
    this.currentBonusOpeningIndex = this.currentBonusOpeningIndex === 0 
      ? this.bonuses.length - 1 
      : this.currentBonusOpeningIndex - 1;
    this.renderBonusOpeningList();
  }

  makeBonusOpeningPanelDraggable(panel) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    // Add drag cursor to the panel header
    const panelTitle = panel.querySelector('.middle-panel-title');
    if (panelTitle) {
      panelTitle.style.cursor = 'move';
      panelTitle.style.userSelect = 'none';
    }

    const handleMouseDown = (e) => {
      // Only allow dragging from the title bar
      if (!e.target.classList.contains('middle-panel-title')) return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = panel.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      panel.style.position = 'fixed';
      panel.style.left = initialX + 'px';
      panel.style.top = initialY + 'px';
      panel.style.transform = 'none';
      panel.style.zIndex = '9999';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newX = initialX + deltaX;
      const newY = initialY + deltaY;
      
      // Keep within screen bounds
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;
      
      panel.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
      panel.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    panel.addEventListener('mousedown', handleMouseDown);
  }

  updateBonusPayout(bonusId, payout) {
    const bonus = this.bonuses.find(b => b.id === bonusId);
    if (bonus) {
      bonus.payout = payout;
      bonus.multiplier = bonus.bet > 0 ? payout / bonus.bet : 0;
      this.updateTotals();
      this.renderBonusList();
    }
  }

  removeBonus(bonusId) {
    this.bonuses = this.bonuses.filter(bonus => bonus.id !== bonusId);
    this.updateTotals();
    this.renderBonusList();
    this.saveBonuses();
    this.showFeedback('Bonus removed', 'info');
  }

  updateTotals() {
    this.totalBet = this.bonuses.reduce((sum, bonus) => sum + bonus.bet, 0);
    this.totalPayout = this.bonuses.reduce((sum, bonus) => sum + (bonus.payout || 0), 0);

    // Update UI
    const totalBetDisplay = document.getElementById('total-bet');
    const totalPayoutDisplay = document.getElementById('total-payout');
    const totalProfitDisplay = document.getElementById('total-profit');

    if (totalBetDisplay) totalBetDisplay.textContent = `€${this.totalBet.toFixed(2)}`;
    if (totalPayoutDisplay) totalPayoutDisplay.textContent = `€${this.totalPayout.toFixed(2)}`;
    if (totalProfitDisplay) {
      const profit = this.totalPayout - this.totalBet;
      totalProfitDisplay.textContent = `€${profit.toFixed(2)}`;
      totalProfitDisplay.className = profit >= 0 ? 'profit-positive' : 'profit-negative';
    }

    // Update stats bar
    this.updateStatsBar();
    
    // Trigger calculator update if available
    if (window.bonusHuntUI) {
      window.bonusHuntUI.onBonusDataChanged();
    }
  }

  updateStatsBar() {
    const startMoneyInput = document.getElementById('start-money-input');
    const stopMoneyInput = document.getElementById('stop-money-input');
    const actualBalanceInput = document.getElementById('actual-balance-input');
    const totalSpentInput = document.getElementById('total-spent-input');
    
    // Update new stats panel
    const statStart = document.getElementById('bh-stat-start');
    const statTarget = document.getElementById('bh-stat-target');
    const statCurrent = document.getElementById('bh-stat-current');
    const statSpent = document.getElementById('bh-stat-spent');
    const statProfit = document.getElementById('bh-stat-profit');
    const statBest = document.getElementById('bh-stat-best');
    const statBestValue = document.getElementById('bh-stat-best-value');
    const statWorst = document.getElementById('bh-stat-worst');
    const statWorstValue = document.getElementById('bh-stat-worst-value');
    const statCount = document.getElementById('bh-stat-count');
    const statAvgX = document.getElementById('bh-stat-avgx');
    const statReqX = document.getElementById('bh-stat-reqx');

    // START: Current money from start money input
    const startMoney = startMoneyInput ? parseFloat(startMoneyInput.value) || 0 : 0;
    const stopMoney = stopMoneyInput ? parseFloat(stopMoneyInput.value) || 0 : 0;
    const actualBalance = actualBalanceInput ? parseFloat(actualBalanceInput.value) || 0 : 0;
    
    if (statStart) statStart.textContent = `€${startMoney.toFixed(2)}`;
    if (statTarget) statTarget.textContent = `€${stopMoney.toFixed(2)}`;
    
    // Total spent (start money - actual balance)
    const totalSpent = startMoney - actualBalance;
    if (totalSpentInput) totalSpentInput.value = totalSpent.toFixed(2);
    if (statSpent) statSpent.textContent = `€${totalSpent.toFixed(2)}`;
    
    // Current balance from input
    if (statCurrent) statCurrent.textContent = `€${actualBalance.toFixed(2)}`;
    
    // Profit/Loss (actual balance + total payout - start money)
    const profit = actualBalance + this.totalPayout - startMoney;
    if (statProfit) {
      statProfit.textContent = `€${profit.toFixed(2)}`;
      statProfit.style.color = profit >= 0 ? '#00ffb8' : '#ff5c5c';
    }
    
    // Total bonuses count
    if (statCount) statCount.textContent = this.bonuses.length.toString();

    // BEST & WORST: Highest and lowest paying slots
    if (this.bonuses.length > 0) {
      // Find best bonus
      const bestBonus = this.bonuses.reduce((best, bonus) => {
        return (bonus.payout || 0) > (best.payout || 0) ? bonus : best;
      });
      
      if (bestBonus.payout && bestBonus.payout > 0) {
        if (statBest) statBest.textContent = bestBonus.slotName;
        if (statBestValue) statBestValue.textContent = `€${bestBonus.payout.toFixed(2)}`;
      } else {
        if (statBest) statBest.textContent = '--';
        if (statBestValue) statBestValue.textContent = '€0.00';
      }

      // Find worst bonus (only among opened bonuses with payout > 0)
      const openedBonuses = this.bonuses.filter(b => b.payout && b.payout > 0);
      if (openedBonuses.length > 0) {
        const worstBonus = openedBonuses.reduce((worst, bonus) => {
          return (bonus.payout || 0) < (worst.payout || 0) ? bonus : worst;
        });
        
        if (statWorst) statWorst.textContent = worstBonus.slotName;
        if (statWorstValue) statWorstValue.textContent = `€${worstBonus.payout.toFixed(2)}`;
      } else {
        if (statWorst) statWorst.textContent = '--';
        if (statWorstValue) statWorstValue.textContent = '€0.00';
      }
    } else {
      if (statBest) statBest.textContent = '--';
      if (statBestValue) statBestValue.textContent = '€0.00';
      if (statWorst) statWorst.textContent = '--';
      if (statWorstValue) statWorstValue.textContent = '€0.00';
    }

    // AVG X: Average multiplier (total payout / total bet)
    const avgX = this.totalBet > 0 ? (this.totalPayout / this.totalBet) : 0;
    if (statAvgX) statAvgX.textContent = `${avgX.toFixed(2)}x`;

    // REQ X: Required multiplier to break even
    const reqX = this.totalBet > 0 ? (this.totalBet / (this.totalBet - this.totalPayout + this.totalBet)) : 0;
    if (statReqX) statReqX.textContent = `${reqX.toFixed(2)}x`;
  }

  clearAllBonuses() {
    if (this.bonuses.length === 0) {
      this.showFeedback('No bonuses to clear', 'info');
      return;
    }

    if (confirm('Are you sure you want to clear all bonuses?')) {
      this.bonuses = [];
      this.updateTotals();
      this.renderBonusList();
      this.saveBonuses();
      this.showFeedback('All bonuses cleared', 'success');
    }
  }

  exportBonuses() {
    if (this.bonuses.length === 0) {
      this.showFeedback('No bonuses to export', 'info');
      return;
    }

    const exportData = {
      bonuses: this.bonuses,
      totals: {
        totalBet: this.totalBet,
        totalPayout: this.totalPayout,
        profit: this.totalPayout - this.totalBet
      },
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bonus-hunt-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.showFeedback('Bonuses exported', 'success');
  }

  saveBonuses() {
    // Save bonuses to localStorage for the overlay page to access
    try {
      const data = {
        bonuses: this.bonuses,
        totalBet: this.totalBet,
        totalPayout: this.totalPayout,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('bonusHuntData', JSON.stringify(data));
      
      // Also save custom slot images
      localStorage.setItem('customSlotImages', JSON.stringify(this.customSlotImages));
    } catch (error) {
      console.error('Error saving bonuses:', error);
    }
  }

  loadSavedBonuses() {
    const saved = localStorage.getItem('bonusHuntData');
    if (saved) {
      try {
        this.bonuses = JSON.parse(saved);
        this.updateTotals();
        this.renderBonusList();
      } catch (error) {
        console.error('Error loading saved bonuses:', error);
      }
    }
  }



  showFeedback(message, type = 'info') {
    // Create or update feedback display
    let feedback = document.getElementById('bonus-hunt-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'bonus-hunt-feedback';
      feedback.className = 'feedback-message';
      document.body.appendChild(feedback);
    }

    feedback.textContent = message;
    feedback.className = `feedback-message ${type}`;
    feedback.style.display = 'block';

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 3000);
  }
}

// Export for use in main script
window.BonusHuntManager = BonusHuntManager;