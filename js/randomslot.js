// ==================== RANDOM SLOT GENERATOR MODULE ====================

class RandomSlotManager {
  constructor() {
    this.currentSlot = null;
    this.history = [];
    this.favorites = [];
    this.init();
  }

  init() {
    console.log('Random Slot Manager initialized');
    this.setupEventListeners();
    this.loadFavorites();
  }

  setupEventListeners() {
    // Generate random slot button
    const generateBtn = document.getElementById('generate-random-slot');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateRandomSlot());
    }

    // Generate by provider buttons
    document.querySelectorAll('.provider-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const provider = e.target.dataset.provider;
        if (provider) {
          this.generateSlotByProvider(provider);
        }
      });
    });

    // Add to favorites
    const favoriteBtn = document.getElementById('add-to-favorites');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => this.addToFavorites());
    }

    // Show history
    const historyBtn = document.getElementById('show-history');
    if (historyBtn) {
      historyBtn.addEventListener('click', () => this.showHistory());
    }

    // Clear history
    const clearHistoryBtn = document.getElementById('clear-history');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    // Provider filter
    const providerFilter = document.getElementById('provider-filter');
    if (providerFilter) {
      providerFilter.addEventListener('change', (e) => {
        this.filterByProvider(e.target.value);
      });
    }

    // Volatility filter
    const volatilityFilter = document.getElementById('volatility-filter');
    if (volatilityFilter) {
      volatilityFilter.addEventListener('change', (e) => {
        this.filterByVolatility(e.target.value);
      });
    }
  }

  generateRandomSlot() {
    if (!slotDatabase || slotDatabase.length === 0) {
      this.showFeedback('Slot database not available', 'error');
      return;
    }

    // Get random slot
    const randomIndex = Math.floor(Math.random() * slotDatabase.length);
    const slot = slotDatabase[randomIndex];
    
    this.currentSlot = slot;
    this.addToHistory(slot);
    this.displaySlot(slot);
    this.showFeedback(`Generated: ${slot.name}`, 'success');
  }

  generateSlotByProvider(providerName) {
    if (!window.slotDatabase || window.slotDatabase.length === 0) {
      this.showFeedback('Slot database not available', 'error');
      return;
    }

    const providerSlots = window.slotDatabase.filter(slot => 
      slot.provider.toLowerCase() === providerName.toLowerCase()
    );

    if (providerSlots.length === 0) {
      this.showFeedback(`No slots found for ${providerName}`, 'error');
      return;
    }

    const randomIndex = Math.floor(Math.random() * providerSlots.length);
    const slot = providerSlots[randomIndex];
    
    this.currentSlot = slot;
    this.addToHistory(slot);
    this.displaySlot(slot);
    this.showFeedback(`Generated ${providerName}: ${slot.name}`, 'success');
  }

  filterByProvider(provider) {
    if (!provider || provider === 'all') {
      this.generateRandomSlot();
      return;
    }

    this.generateSlotByProvider(provider);
  }

  filterByVolatility(volatility) {
    if (!window.slotDatabase || window.slotDatabase.length === 0) {
      this.showFeedback('Slot database not available', 'error');
      return;
    }

    if (!volatility || volatility === 'all') {
      this.generateRandomSlot();
      return;
    }

    const volatilitySlots = window.slotDatabase.filter(slot => 
      slot.volatility && slot.volatility.toLowerCase() === volatility.toLowerCase()
    );

    if (volatilitySlots.length === 0) {
      this.showFeedback(`No ${volatility} volatility slots found`, 'error');
      return;
    }

    const randomIndex = Math.floor(Math.random() * volatilitySlots.length);
    const slot = volatilitySlots[randomIndex];
    
    this.currentSlot = slot;
    this.addToHistory(slot);
    this.displaySlot(slot);
    this.showFeedback(`Generated ${volatility}: ${slot.name}`, 'success');
  }

  displaySlot(slot) {
    // Update main display
    const slotImage = document.getElementById('random-slot-image');
    const slotName = document.getElementById('random-slot-name');
    const slotProvider = document.getElementById('random-slot-provider');
    const slotRTP = document.getElementById('random-slot-rtp');
    const slotVolatility = document.getElementById('random-slot-volatility');
    const slotMaxWin = document.getElementById('random-slot-maxwin');

    if (slotImage) {
      slotImage.src = slot.image || 'https://i.imgur.com/8E3ucNx.png';
      slotImage.alt = slot.name;
    }

    if (slotName) slotName.textContent = slot.name;
    if (slotProvider) slotProvider.textContent = slot.provider;
    if (slotRTP) slotRTP.textContent = slot.rtp ? `${slot.rtp}%` : 'N/A';
    if (slotVolatility) slotVolatility.textContent = slot.volatility || 'N/A';
    if (slotMaxWin) slotMaxWin.textContent = slot.maxWin ? `${slot.maxWin}x` : 'N/A';

    // Show the display
    const randomSlotDisplay = document.getElementById('random-slot-display');
    if (randomSlotDisplay) {
      randomSlotDisplay.style.display = 'block';
    }

    // Update additional info if available
    this.updateSlotDetails(slot);
  }

  updateSlotDetails(slot) {
    // Update any additional slot details like features, themes, etc.
    const featuresContainer = document.getElementById('slot-features');
    if (featuresContainer && slot.features) {
      featuresContainer.innerHTML = slot.features.map(feature => 
        `<span class="feature-tag">${feature}</span>`
      ).join('');
    }

    const themesContainer = document.getElementById('slot-themes');
    if (themesContainer && slot.themes) {
      themesContainer.innerHTML = slot.themes.map(theme => 
        `<span class="theme-tag">${theme}</span>`
      ).join('');
    }
  }

  addToHistory(slot) {
    // Add to beginning of history, limit to 50 entries
    this.history.unshift({
      ...slot,
      timestamp: new Date().toISOString()
    });
    
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }
    
    this.saveHistory();
  }

  addToFavorites() {
    if (!this.currentSlot) {
      this.showFeedback('No slot selected to add to favorites', 'error');
      return;
    }

    // Check if already in favorites
    const exists = this.favorites.some(fav => fav.name === this.currentSlot.name);
    if (exists) {
      this.showFeedback('Slot already in favorites', 'info');
      return;
    }

    this.favorites.push({
      ...this.currentSlot,
      addedAt: new Date().toISOString()
    });
    
    this.saveFavorites();
    this.showFeedback(`Added ${this.currentSlot.name} to favorites`, 'success');
  }

  showHistory() {
    if (this.history.length === 0) {
      this.showFeedback('No history available', 'info');
      return;
    }

    // Create history modal or display
    const historyDisplay = document.getElementById('slot-history-display');
    if (historyDisplay) {
      let historyHTML = '<h3>Recent Slots</h3><div class="history-list">';
      
      this.history.slice(0, 10).forEach((slot, index) => {
        historyHTML += `
          <div class="history-item" onclick="randomSlotManager.displaySlot(${JSON.stringify(slot).replace(/"/g, '&quot;')})">
            <img src="${slot.image}" alt="${slot.name}" class="history-slot-image">
            <div class="history-info">
              <div class="history-name">${slot.name}</div>
              <div class="history-provider">${slot.provider}</div>
              <div class="history-time">${new Date(slot.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        `;
      });
      
      historyHTML += '</div>';
      historyDisplay.innerHTML = historyHTML;
      historyDisplay.style.display = 'block';
    }
  }

  clearHistory() {
    if (this.history.length === 0) {
      this.showFeedback('No history to clear', 'info');
      return;
    }

    if (confirm('Are you sure you want to clear the slot history?')) {
      this.history = [];
      this.saveHistory();
      this.showFeedback('History cleared', 'success');
      
      const historyDisplay = document.getElementById('slot-history-display');
      if (historyDisplay) {
        historyDisplay.style.display = 'none';
      }
    }
  }

  saveHistory() {
    localStorage.setItem('randomSlotHistory', JSON.stringify(this.history));
  }

  loadHistory() {
    const saved = localStorage.getItem('randomSlotHistory');
    if (saved) {
      try {
        this.history = JSON.parse(saved);
      } catch (error) {
        console.error('Error loading slot history:', error);
      }
    }
  }

  saveFavorites() {
    localStorage.setItem('randomSlotFavorites', JSON.stringify(this.favorites));
  }

  loadFavorites() {
    const saved = localStorage.getItem('randomSlotFavorites');
    if (saved) {
      try {
        this.favorites = JSON.parse(saved);
      } catch (error) {
        console.error('Error loading slot favorites:', error);
      }
    }
  }

  showFeedback(message, type = 'info') {
    // Create or update feedback display
    let feedback = document.getElementById('random-slot-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'random-slot-feedback';
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

  // Get random slot by criteria
  getRandomSlotByCriteria(criteria = {}) {
    if (!window.slotDatabase || window.slotDatabase.length === 0) return null;
    
    let filteredSlots = [...window.slotDatabase];
    
    if (criteria.provider) {
      filteredSlots = filteredSlots.filter(slot => 
        slot.provider.toLowerCase() === criteria.provider.toLowerCase()
      );
    }

    if (criteria.volatility) {
      filteredSlots = filteredSlots.filter(slot => 
        slot.volatility && slot.volatility.toLowerCase() === criteria.volatility.toLowerCase()
      );
    }

    if (criteria.minRTP) {
      filteredSlots = filteredSlots.filter(slot => 
        slot.rtp && parseFloat(slot.rtp) >= criteria.minRTP
      );
    }

    if (criteria.maxRTP) {
      filteredSlots = filteredSlots.filter(slot => 
        slot.rtp && parseFloat(slot.rtp) <= criteria.maxRTP
      );
    }

    if (filteredSlots.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filteredSlots.length);
    return filteredSlots[randomIndex];
  }
}

// Export for use in main script
window.RandomSlotManager = RandomSlotManager;