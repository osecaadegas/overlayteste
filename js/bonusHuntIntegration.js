/**
 * Integration Guide for Bonus Hunt Calculator
 * How to integrate the calculator with your existing bonus hunt system
 */

// Import the calculator (if using modules) or it's available globally as window.BonusHuntCalculator

class BonusHuntUI {
  constructor() {
    this.calculator = new BonusHuntCalculator();
    this.setupEventListeners();
    this.initializeFromLocalStorage();
  }

  /**
   * Initialize calculator with data from localStorage (your existing system)
   */
  initializeFromLocalStorage() {
    try {
      const savedData = localStorage.getItem('bonusHuntData');
      console.log('Raw localStorage data:', savedData);
      
      if (savedData) {
        const data = JSON.parse(savedData);
        console.log('Parsed data:', data);
        
        // Convert your existing bonus format to calculator format
        const bonuses = (data.bonuses || []).map(bonus => ({
          id: bonus.id,
          name: bonus.slot,           // your 'slot' becomes 'name'
          bet: bonus.bet,
          win: bonus.payout !== null && bonus.payout !== undefined ? bonus.payout : null,     // your 'payout' becomes 'win'  
          isSuper: bonus.isSuper || false,
          timestamp: bonus.timestamp
        }));

        // Get balance values from inputs or saved data
        const startMoney = this.getInputValue('start-money-input');
        const targetMoney = this.getInputValue('stop-money-input');
        const currentBalance = this.getInputValue('actual-balance-input');

        console.log('Converted bonuses:', bonuses);
        console.log('Balance values - Start:', startMoney, 'Target:', targetMoney, 'Current:', currentBalance);

        this.calculator.updateData(bonuses, startMoney, targetMoney, currentBalance);
        
        // Force immediate calculation and display
        const stats = this.calculator.calculateTotals();
        console.log('Calculated stats:', stats);
        
        this.updateAllDisplays();
      }
    } catch (error) {
      console.error('Error initializing from localStorage:', error);
    }
  }

  /**
   * Setup event listeners for automatic updates
   */
  setupEventListeners() {
    // Listen for balance input changes
    const balanceInputs = [
      'start-money-input',
      'stop-money-input', 
      'actual-balance-input'
    ];

    balanceInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', () => {
          this.updateCalculatorFromInputs();
          this.updateAllDisplays();
        });
      }
    });

    // Listen for localStorage changes (when bonuses are updated)
    window.addEventListener('storage', (e) => {
      if (e.key === 'bonusHuntData') {
        this.initializeFromLocalStorage();
      }
    });

    // Poll for localStorage changes (for same-window updates)
    this.lastDataString = localStorage.getItem('bonusHuntData') || '';
    setInterval(() => {
      const currentDataString = localStorage.getItem('bonusHuntData') || '';
      if (currentDataString !== this.lastDataString) {
        this.lastDataString = currentDataString;
        this.initializeFromLocalStorage();
      }
    }, 500);
  }

  /**
   * Update calculator with current input values
   */
  updateCalculatorFromInputs() {
    const startMoney = this.getInputValue('start-money-input');
    const targetMoney = this.getInputValue('stop-money-input');
    const currentBalance = this.getInputValue('actual-balance-input');

    this.calculator.updateData(
      this.calculator.bonuses, 
      startMoney, 
      targetMoney, 
      currentBalance
    );
  }

  /**
   * Get numeric value from input element
   */
  getInputValue(inputId) {
    const input = document.getElementById(inputId);
    return input ? parseFloat(input.value) || 0 : 0;
  }

  /**
   * Call this whenever a bonus is added/updated/removed
   */
  onBonusDataChanged() {
    this.initializeFromLocalStorage();
  }

  /**
   * Update all display elements with calculated values
   */
  updateAllDisplays() {
    const stats = this.calculator.calculateTotals();
    console.log('Updating displays with stats:', stats);

    // Update your existing stat elements
    this.updateStatElement('bh-stat-start', this.calculator.formatCurrency(stats.startMoney));
    this.updateStatElement('bh-stat-target', this.calculator.formatCurrency(stats.targetMoney));
    this.updateStatElement('bh-stat-current', this.calculator.formatCurrency(stats.currentBalance));
    this.updateStatElement('bh-stat-spent', this.calculator.formatCurrency(stats.totalSpent));
    
    // Profit/Loss with color coding
    const profitElement = document.getElementById('bh-stat-profit');
    if (profitElement) {
      profitElement.textContent = this.calculator.formatCurrency(Math.abs(stats.profitLoss));
      profitElement.style.color = stats.profitLoss >= 0 ? '#00ffb8' : '#ff5c5c';
    }

    // Best and worst slots
    this.updateStatElement('bh-stat-best', stats.bestSlot ? stats.bestSlot.name : '--');
    this.updateStatElement('bh-stat-best-value', stats.bestSlot ? 
      this.calculator.formatCurrency(stats.bestSlot.win) : '€0.00');
    
    this.updateStatElement('bh-stat-worst', stats.worstSlot ? stats.worstSlot.name : '--');
    this.updateStatElement('bh-stat-worst-value', stats.worstSlot ? 
      this.calculator.formatCurrency(stats.worstSlot.win) : '€0.00');

    // Counts and multipliers - with debug logging
    console.log('Total bonuses:', stats.totalBonuses);
    console.log('Average multiplier:', stats.averageMultiplier);
    console.log('Required multiplier:', stats.requiredMultiplier);
    
    // Use the correct element IDs from your HTML
    this.updateStatElement('bh-stat-total-bonuses', stats.totalBonuses.toString());
    this.updateStatElement('bh-stat-avg-multi', stats.averageMultiplier > 0 ? this.calculator.formatMultiplier(stats.averageMultiplier) : '0.00x');
    this.updateStatElement('bh-stat-req-multi', stats.requiredMultiplier !== null && stats.requiredMultiplier > 0 ? this.calculator.formatMultiplier(stats.requiredMultiplier) : '0.00x');

    // Update total spent input (auto-calculated)
    const totalSpentInput = document.getElementById('total-spent-input');
    if (totalSpentInput) {
      totalSpentInput.value = stats.totalSpent.toFixed(2);
    }

    // Additional stats you might want to display
    console.log('Hunt Progress:', this.calculator.formatPercentage(stats.huntProgress));
    console.log('Bonuses Opened:', `${stats.openedBonuses}/${stats.totalBonuses}`);
  }

  /**
   * Update a stat display element
   */
  updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`Updating element ${elementId} with value:`, value);
      element.textContent = value;
    } else {
      console.warn(`Element not found: ${elementId}`);
    }
  }

  /**
   * Get current statistics (for external use)
   */
  getCurrentStats() {
    return this.calculator.calculateTotals();
  }

  /**
   * Export hunt data
   */
  exportHunt() {
    const data = this.calculator.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bonus-hunt-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Import hunt data
   */
  importHunt(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.calculator.importData(data);
        this.updateAllDisplays();
        console.log('Hunt data imported successfully');
      } catch (error) {
        console.error('Error importing hunt data:', error);
      }
    };
    reader.readAsText(file);
  }
}

// Integration with your existing BonusHuntManager
function integrateWithExistingSystem() {
  // Create the UI calculator
  const huntUI = new BonusHuntUI();

  // Modify your existing BonusHuntManager methods to trigger updates
  const originalUpdateTotals = window.BonusHuntManager.prototype.updateTotals;
  window.BonusHuntManager.prototype.updateTotals = function() {
    // Call original method
    originalUpdateTotals.call(this);
    
    // Trigger calculator update
    if (window.bonusHuntUI) {
      window.bonusHuntUI.onBonusDataChanged();
    }
  };

  // Make huntUI globally available
  window.bonusHuntUI = huntUI;

  return huntUI;
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof BonusHuntCalculator !== 'undefined') {
    integrateWithExistingSystem();
    console.log('Bonus Hunt Calculator integrated successfully');
    
    // Force initial update after a short delay to ensure everything is loaded
    setTimeout(() => {
      if (window.bonusHuntUI) {
        console.log('Forcing initial data load...');
        window.bonusHuntUI.initializeFromLocalStorage();
      }
    }, 1000);
  }
});

// Also try to initialize when the script loads (fallback)
if (typeof BonusHuntCalculator !== 'undefined' && document.readyState === 'complete') {
  integrateWithExistingSystem();
  console.log('Bonus Hunt Calculator integrated (immediate)');
}

// Add a global function to manually test the integration
window.testBonusCalculator = function() {
  console.log('Testing bonus calculator...');
  
  // Test with sample data
  const testBonuses = [
    { slot: 'Gates of Olympus SuperScatter', bet: 1.00, payout: null, isSuper: false },
    { slot: 'Sweet Bonanza', bet: 2.00, payout: 15.50, isSuper: true }
  ];
  
  if (window.bonusHuntUI) {
    window.bonusHuntUI.calculator.updateData(testBonuses, 100, 150, 20);
    const stats = window.bonusHuntUI.calculator.calculateTotals();
    console.log('Test stats:', stats);
    window.bonusHuntUI.updateAllDisplays();
  } else {
    console.error('bonusHuntUI not available');
  }
};

// Example of manual integration calls:
/*
// When you add a bonus in your existing system:
window.bonusHuntUI.onBonusDataChanged();

// When you update a payout:
window.bonusHuntUI.onBonusDataChanged();

// Get current statistics:
const stats = window.bonusHuntUI.getCurrentStats();
console.log('Current hunt stats:', stats);

// Export hunt:
window.bonusHuntUI.exportHunt();
*/