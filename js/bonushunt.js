// ==================== BONUS HUNT MODULE ====================

class BonusHuntManager {
  constructor() {
    this.bonuses = [];
    this.totalBet = 0;
    this.totalPayout = 0;
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

    // Start money and stop money inputs for stats bar
    const startMoneyInput = document.getElementById('start-money-input');
    const stopMoneyInput = document.getElementById('stop-money-input');
    if (startMoneyInput) {
      startMoneyInput.addEventListener('input', () => this.updateStatsBar());
    }
    if (stopMoneyInput) {
      stopMoneyInput.addEventListener('input', () => this.updateStatsBar());
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

    if (middlePanel) middlePanel.style.display = 'none';
    if (bonusOpeningPanel) {
      bonusOpeningPanel.style.display = 'flex';
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

    bonusOpeningList.innerHTML = '';

    this.bonuses.forEach(bonus => {
      const bonusItem = document.createElement('div');
      bonusItem.className = 'bonus-opening-item';
      
      const slotImage = this.getSlotImage(bonus.slot);
      
      bonusItem.innerHTML = `
        <div class="bonus-opening-header">
          <img src="${slotImage}" alt="${bonus.slot}" class="bonus-opening-image">
          <div class="bonus-opening-info">
            <div class="bonus-opening-name">${bonus.slot}</div>
            <div class="bonus-opening-bet">Bet: €${bonus.bet.toFixed(2)}</div>
          </div>
        </div>
        <div class="bonus-opening-payout">
          <label>Payout Amount:</label>
          <input type="number" 
                 class="payout-input" 
                 placeholder="Enter payout" 
                 value="${bonus.payout !== null ? bonus.payout : ''}"
                 min="0" 
                 step="0.01"
                 data-bonus-id="${bonus.id}">
        </div>
      `;

      const payoutInput = bonusItem.querySelector('.payout-input');
      payoutInput.addEventListener('input', (e) => {
        this.updateBonusPayout(bonus.id, parseFloat(e.target.value) || 0);
      });

      bonusOpeningList.appendChild(bonusItem);
    });
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
  }

  updateStatsBar() {
    const startMoneyInput = document.getElementById('start-money-input');
    const stopMoneyInput = document.getElementById('stop-money-input');
    const startValue = document.getElementById('bh-start-value');
    const targetValue = document.getElementById('bh-target-value');
    const worstValue = document.getElementById('bh-worst-value');
    const avgXValue = document.getElementById('bh-avgx-value');
    const reqXValue = document.getElementById('bh-reqx-value');
    const bestSlotIcon = document.getElementById('bh-best-slot-icon');
    const worstSlotIcon = document.getElementById('bh-worst-slot-icon');

    if (!startValue || !targetValue || !avgXValue || !reqXValue) return;

    // START: Current money from start money input
    const startMoney = startMoneyInput ? parseFloat(startMoneyInput.value) || 0 : 0;
    startValue.textContent = `€${startMoney.toFixed(2)}`;

    // BEST & WORST: Highest and lowest paying slots
    if (this.bonuses.length > 0) {
      // Find best bonus
      const bestBonus = this.bonuses.reduce((best, bonus) => {
        return (bonus.payout || 0) > (best.payout || 0) ? bonus : best;
      });
      
      if (bestBonus.payout && bestBonus.payout > 0) {
        const bestSlotImage = this.getSlotImage(bestBonus.slotName);
        if (bestSlotImage && bestSlotIcon) {
          bestSlotIcon.innerHTML = `<img src="${bestSlotImage}" alt="${bestBonus.slotName}" style="width: 32px; height: 32px; border-radius: 6px;">`;
        }
        targetValue.textContent = bestBonus.slotName.length > 12 ? bestBonus.slotName.substring(0, 12) + '...' : bestBonus.slotName;
      } else {
        if (bestSlotIcon) bestSlotIcon.innerHTML = '🎰';
        targetValue.textContent = '--';
      }

      // Find worst bonus (only among opened bonuses with payout > 0)
      const openedBonuses = this.bonuses.filter(b => b.payout && b.payout > 0);
      if (openedBonuses.length > 0) {
        const worstBonus = openedBonuses.reduce((worst, bonus) => {
          return (bonus.payout || 0) < (worst.payout || 0) ? bonus : worst;
        });
        
        const worstSlotImage = this.getSlotImage(worstBonus.slotName);
        if (worstSlotImage && worstSlotIcon) {
          worstSlotIcon.innerHTML = `<img src="${worstSlotImage}" alt="${worstBonus.slotName}" style="width: 32px; height: 32px; border-radius: 6px;">`;
        }
        if (worstValue) {
          worstValue.textContent = worstBonus.slotName.length > 12 ? worstBonus.slotName.substring(0, 12) + '...' : worstBonus.slotName;
        }
      } else {
        if (worstSlotIcon) worstSlotIcon.innerHTML = '💀';
        if (worstValue) worstValue.textContent = '--';
      }
    } else {
      if (bestSlotIcon) bestSlotIcon.innerHTML = '🎰';
      targetValue.textContent = '--';
      if (worstSlotIcon) worstSlotIcon.innerHTML = '💀';
      if (worstValue) worstValue.textContent = '--';
    }

    // AVG X: Average multiplier (total payout / total bet)
    const avgX = this.totalBet > 0 ? (this.totalPayout / this.totalBet) : 0;
    avgXValue.textContent = `${avgX.toFixed(2)}X`;

    // REQ X: Required multiplier to break even (1.0 if avgX < 1, otherwise 0)
    const reqX = avgX < 1 ? (1.0 - avgX) : 0;
    reqXValue.textContent = `${reqX.toFixed(2)}X`;
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
    // Disabled - bonuses are not saved to localStorage anymore
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