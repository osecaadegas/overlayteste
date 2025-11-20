// ==================== MAIN APPLICATION CONTROLLER ====================

class StreamerOverlayApp {
  constructor() {
    this.modules = {};
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    console.log('🚀 Initializing Streamer Overlay Dashboard...');
    
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Initialize core functionality
      this.initializeCoreFeatures();
      
      // Initialize modules
      await this.initializeModules();
      
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      this.isInitialized = true;
      console.log('✅ Streamer Overlay Dashboard initialized successfully');
      
      // Emit ready event
      if (window.eventEmitter) {
        window.eventEmitter.emit('app:ready');
      }
      
    } catch (error) {
      console.error('❌ Error initializing application:', error);
    }
  }

  initializeCoreFeatures() {
    console.log('⚙️ Initializing core features...');
    
    // Check if slotDatabase is loaded
    if (typeof window.slotDatabase !== 'undefined' && window.slotDatabase && window.slotDatabase.length > 0) {
      console.log('✅ slotDatabase loaded successfully with', window.slotDatabase.length, 'slots');
    } else {
      console.error('❌ slotDatabase not loaded or empty');
    }
    
    // Initialize sidebar backgrounds
    if (localStorage.getItem('sidebarBackgroundsEnabled') === null) {
      localStorage.setItem('sidebarBackgroundsEnabled', 'false');
    }
    
    if (localStorage.getItem('sidebarBackgroundsEnabled') === 'false') {
      requestAnimationFrame(() => {
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
          btn.classList.add('no-background');
        });
      });
    }
    
    // Initialize time display
    this.initializeTimeDisplay();
    
    // Initialize basic UI interactions
    this.initializeBasicUI();
  }

  async initializeModules() {
    console.log('📦 Initializing modules...');
    
    // Initialize modules with error handling
    const moduleInits = [
      { name: 'tournament', class: 'TournamentManager' },
      { name: 'bonusHunt', class: 'BonusHuntManager' },
      { name: 'randomSlot', class: 'RandomSlotManager' },
      { name: 'tutorial', class: 'TutorialManager' }
    ];

    for (const moduleInfo of moduleInits) {
      try {
        if (window[moduleInfo.class]) {
          this.modules[moduleInfo.name] = new window[moduleInfo.class]();
          console.log(`✅ ${moduleInfo.name} module initialized`);
        } else {
          console.warn(`⚠️ ${moduleInfo.class} not found, skipping ${moduleInfo.name} module`);
        }
      } catch (error) {
        console.error(`❌ Error initializing ${moduleInfo.name} module:`, error);
      }
    }

    // Make modules globally accessible
    window.tournamentManager = this.modules.tournament;
    window.bonusHuntManager = this.modules.bonusHunt;
    window.randomSlotManager = this.modules.randomSlot;
    window.tutorialManager = this.modules.tutorial;
  }

  setupGlobalEventListeners() {
    console.log('🎧 Setting up global event listeners...');
    
    // Sidebar button management
    this.setupSidebarNavigation();
    
    // Logo and website editing
    this.setupLogoAndWebsiteEditing();
    
    // Image upload functionality
    this.setupImageUpload();
    
    // Navbar image switcher
    this.setupNavbarSwitcher();
    
    // Twitch chat functionality
    this.setupTwitchChat();
    
    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  setupSidebarNavigation() {
    // Initialize sidebar toggle functionality
    this.initializeSidebarToggle();
    
    const bhBtn = document.getElementById('bh-btn');
    const boBtn = document.getElementById('bo-btn');
    const randomSlotBtn = document.getElementById('random-slot-btn');
    const tournamentBtn = document.getElementById('tournament-btn');
    
    const infoPanel = document.querySelector('.info-panel');
    const middlePanel = document.getElementById('middle-panel');
    const randomSlotPanel = document.getElementById('random-slot-panel');
    const tournamentPanel = document.getElementById('tournament-panel');
    
    let panelVisible = false;
    let randomSlotPanelVisible = false;
    let tournamentPanelVisible = false;
    let tournamentInitialized = false;

    const updateInfoPanelVisibility = () => {
      const bhActive = bhBtn && bhBtn.classList.contains('active');
      const boActive = boBtn && boBtn.classList.contains('active');
      const randomSlotActive = randomSlotBtn && randomSlotBtn.classList.contains('active');
      const tournamentActive = tournamentBtn && tournamentBtn.classList.contains('active');
      
      if (infoPanel) {
        if (tournamentActive) {
          infoPanel.classList.remove('info-panel--visible');
        } else if (bhActive || boActive || randomSlotActive) {
          infoPanel.classList.add('info-panel--visible');
        } else {
          infoPanel.classList.remove('info-panel--visible');
        }
      }
    };

    // Bonus Hunt button
    if (bhBtn && middlePanel) {
      bhBtn.addEventListener('click', () => {
        panelVisible = !panelVisible;
        middlePanel.style.display = panelVisible ? 'flex' : 'none';
        bhBtn.classList.toggle('active', panelVisible);
        if (panelVisible) makePanelInteractive(middlePanel);
        
        if (!panelVisible) {
          this.hideSelectedSlot();
        }
        
        if (randomSlotPanel && panelVisible) {
          randomSlotPanel.style.display = 'none';
        }
        
        if (panelVisible) {
          document.querySelectorAll('.sidebar-btn').forEach(btn => {
            if (btn !== bhBtn) btn.classList.remove('active');
          });
        }
        updateInfoPanelVisibility();
      });
    }

    // Tutorial button (bo-btn with info icon)
    if (boBtn) {
      boBtn.addEventListener('click', () => {
        console.log('Tutorial button clicked');
        console.log('window.tutorialManager:', window.tutorialManager);
        console.log('window.TutorialManager class:', window.TutorialManager);
        
        if (window.tutorialManager && typeof window.tutorialManager.openTutorial === 'function') {
          console.log('Opening tutorial...');
          window.tutorialManager.openTutorial();
        } else if (window.TutorialManager) {
          console.warn('TutorialManager class exists but instance not created, creating now...');
          window.tutorialManager = new window.TutorialManager();
          window.tutorialManager.openTutorial();
        } else {
          console.error('Tutorial manager not initialized');
          console.error('Available modules:', Object.keys(this.modules || {}));
        }
      });
    }

    // Random Slot button
    if (randomSlotBtn && randomSlotPanel) {
      randomSlotBtn.addEventListener('click', () => {
        randomSlotPanelVisible = !randomSlotPanelVisible;
        randomSlotPanel.style.display = randomSlotPanelVisible ? 'flex' : 'none';
        randomSlotBtn.classList.toggle('active', randomSlotPanelVisible);
        if (randomSlotPanelVisible) makePanelInteractive(randomSlotPanel);
        
        if (randomSlotPanelVisible) {
          middlePanel.style.display = 'none';
          panelVisible = false;
          this.hideSelectedSlot();
        }
        
        if (randomSlotPanelVisible) {
          document.querySelectorAll('.sidebar-btn').forEach(btn => {
            if (btn !== randomSlotBtn) btn.classList.remove('active');
          });
        }
        updateInfoPanelVisibility();
      });
    }

    // Tournament button
    if (tournamentBtn && tournamentPanel) {
      tournamentBtn.addEventListener('click', () => {
        if (this.modules.tournament && this.modules.tournament.state.isActive) {
          // Show the tournament bracket if already active
          if (this.modules.tournament.showTournamentBracket) {
            this.modules.tournament.showTournamentBracket(this.modules.tournament.state.participants);
          }
          return;
        }
        
        tournamentPanelVisible = !tournamentPanelVisible;
        tournamentPanel.style.display = tournamentPanelVisible ? 'flex' : 'none';
        tournamentBtn.classList.toggle('active', tournamentPanelVisible);
        if (tournamentPanelVisible) makePanelInteractive(tournamentPanel);
        
        const controlPanel = document.getElementById('tournament-control-panel');
        if (controlPanel && tournamentPanelVisible) makePanelInteractive(controlPanel);
        if (controlPanel) {
          controlPanel.style.display = 'none';
        }
        
        if (tournamentPanelVisible && !tournamentInitialized && this.modules.tournament) {
          setTimeout(() => {
            this.modules.tournament.generateParticipantInputs();
          }, 200);
          tournamentInitialized = true;
        }
        
        if (tournamentPanelVisible) {
          middlePanel.style.display = 'none';
          randomSlotPanel.style.display = 'none';
          panelVisible = false;
          randomSlotPanelVisible = false;
          this.hideSelectedSlot();
        }
        
        if (tournamentPanelVisible) {
          document.querySelectorAll('.sidebar-btn').forEach(btn => {
            if (btn !== tournamentBtn) btn.classList.remove('active');
          });
        }
        updateInfoPanelVisibility();
      });
    }

    // Customization button
    const customizationBtn = document.getElementById('customization-btn');
    const customizationPanel = document.getElementById('customization-panel');
    if (customizationBtn && customizationPanel) {
      customizationBtn.addEventListener('click', () => {
        const isVisible = customizationPanel.style.display === 'flex';
        customizationPanel.style.display = isVisible ? 'none' : 'flex';
        customizationBtn.classList.toggle('active', !isVisible);
        if (!isVisible) makePanelInteractive(customizationPanel);
      });

      // Close button in customization panel
      const closeCustomizationBtn = document.getElementById('close-customization-btn');
      if (closeCustomizationBtn) {
        closeCustomizationBtn.addEventListener('click', () => {
          customizationPanel.style.display = 'none';
          customizationBtn.classList.remove('active');
        });
      }

      // Tab switching
      const tabButtons = customizationPanel.querySelectorAll('.tab-btn');
      const tabContents = customizationPanel.querySelectorAll('.tab-content');
      
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const targetTab = button.getAttribute('data-tab');
          
          // Update active tab button
          tabButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          // Show corresponding tab content
          tabContents.forEach(content => {
            content.style.display = content.id === targetTab ? 'block' : 'none';
          });
        });
      });
    }

    // Lock/Unlock button
    const lockBtn = document.getElementById('lock-btn');
    const lockIcon = document.getElementById('lock-icon');
    if (lockBtn && lockIcon) {
      let isLocked = false;
      lockBtn.addEventListener('click', () => {
        isLocked = !isLocked;
        lockIcon.src = isLocked ? './assets/lock.png' : './assets/unlock.png';
        lockBtn.classList.toggle('active', isLocked);
        
        // Toggle lock state globally
        window.isLayoutLocked = isLocked;
        
        // Lock/unlock all panels
        document.querySelectorAll('.middle-panel, .tournament-control-panel, .customization-panel').forEach(panel => {
          if (isLocked) {
            panel.style.pointerEvents = 'auto';
            const title = panel.querySelector('.middle-panel-title, .tournament-control-header, .customization-header');
            if (title) title.style.cursor = 'default';
            const resizeHandle = panel.querySelector('.resize-handle');
            if (resizeHandle) resizeHandle.style.display = 'none';
          } else {
            const title = panel.querySelector('.middle-panel-title, .tournament-control-header, .customization-header');
            if (title) title.style.cursor = 'move';
            const resizeHandle = panel.querySelector('.resize-handle');
            if (resizeHandle) resizeHandle.style.display = 'block';
          }
        });
        
        // Lock/unlock draggable images
        document.querySelectorAll('.draggable-image-container').forEach(container => {
          if (isLocked) {
            container.classList.add('locked');
            container.style.cursor = 'default';
            container.style.border = 'none';
            container.style.boxShadow = 'none';
            const controls = container.querySelector('.image-controls');
            if (controls) controls.style.display = 'none';
            const resizeHandle = container.querySelector('.resize-handle');
            if (resizeHandle) resizeHandle.style.display = 'none';
            const video = container.querySelector('video');
            if (video) {
              video.controls = false;
              video.removeAttribute('controls');
            }
          } else {
            container.classList.remove('locked');
            container.style.cursor = 'move';
            container.style.border = '';
            container.style.boxShadow = '';
            const controls = container.querySelector('.image-controls');
            if (controls) controls.style.display = 'flex';
            const resizeHandle = container.querySelector('.resize-handle');
            if (resizeHandle) resizeHandle.style.display = 'block';
            const video = container.querySelector('video');
            if (video) {
              video.controls = true;
              video.setAttribute('controls', 'controls');
            }
          }
        });
      });
    }
  }

  setupLogoAndWebsiteEditing() {
    const logoUploadInput = document.getElementById('logo-upload-input');
    const navbarLogo = document.getElementById('navbar-logo');
    const streamerName = document.getElementById('streamer-name');
    const streamerNameInput = document.getElementById('streamer-name-input');
    const websiteText = document.getElementById('website-text');
    const websiteInput = document.getElementById('website-input');

    // Logo upload
    if (navbarLogo && logoUploadInput) {
      const savedLogo = localStorage.getItem('customNavbarLogo');
      if (savedLogo) {
        navbarLogo.src = savedLogo;
      }

      navbarLogo.addEventListener('click', () => {
        if (window.isDragLocked) return;
        logoUploadInput.click();
      });

      logoUploadInput.addEventListener('change', (e) => {
        const file = logoUploadInput.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            NotificationManager.error('Please select an image file.');
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            NotificationManager.error('Please select an image smaller than 5MB.');
            return;
          }

          const reader = new FileReader();
          reader.onload = function(evt) {
            const newLogoSrc = evt.target.result;
            navbarLogo.src = newLogoSrc;
            localStorage.setItem('customNavbarLogo', newLogoSrc);
            NotificationManager.success('Logo updated successfully!');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Streamer name editing
    if (streamerName && streamerNameInput) {
      const savedName = localStorage.getItem('customStreamerName');
      if (savedName) {
        streamerName.textContent = savedName;
      }

      streamerName.addEventListener('click', () => {
        if (window.isDragLocked) return;
        streamerName.style.display = 'none';
        streamerNameInput.style.display = 'inline-block';
        streamerNameInput.value = streamerName.textContent;
        streamerNameInput.focus();
        streamerNameInput.select();
      });

      const saveStreamerName = () => {
        const newName = streamerNameInput.value.trim() || 'Osecaadegas95';
        streamerName.textContent = newName;
        localStorage.setItem('customStreamerName', newName);
        streamerNameInput.style.display = 'none';
        streamerName.style.display = 'inline-block';
      };

      streamerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveStreamerName();
      });

      streamerNameInput.addEventListener('blur', saveStreamerName);
    }

    // Website editing
    if (websiteText && websiteInput) {
      const savedUrl = localStorage.getItem('customWebsiteUrl');
      const savedText = localStorage.getItem('customWebsiteText');
      
      if (savedUrl && savedText) {
        document.getElementById('website-link').href = savedUrl;
        websiteText.textContent = savedText;
      }

      websiteText.addEventListener('click', () => {
        if (window.isDragLocked) return;
        websiteText.style.display = 'none';
        websiteInput.style.display = 'inline-block';
        websiteInput.focus();
      });

      const saveWebsiteUrl = () => {
        let newUrl = websiteInput.value.trim();
        if (newUrl && !newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
          newUrl = 'https://' + newUrl;
        }
        
        if (newUrl) {
          const fullUrl = newUrl;
          document.getElementById('website-link').href = fullUrl;
          
          const displayText = newUrl.replace(/^https?:\/\//, '');
          websiteText.textContent = displayText;
          
          localStorage.setItem('customWebsiteUrl', fullUrl);
          localStorage.setItem('customWebsiteText', displayText);
        }
        
        websiteInput.style.display = 'none';
        websiteText.style.display = 'inline-block';
      };

      websiteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveWebsiteUrl();
      });

      websiteInput.addEventListener('blur', saveWebsiteUrl);
    }
  }

  setupImageUpload() {
    const adInput = document.getElementById('ad-image-input');
    if (adInput) {
      adInput.addEventListener('change', (e) => {
        const file = adInput.files[0];
        if (file) {
          const fileType = file.type.split('/')[0]; // 'image' or 'video'
          const reader = new FileReader();
          reader.onload = (evt) => {
            this.createDraggableMedia(evt.target.result, fileType);
            // Clear the input so the same file can be selected again
            adInput.value = '';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Shift + T = Toggle Tournament
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        const tournamentBtn = document.getElementById('tournament-btn');
        if (tournamentBtn) tournamentBtn.click();
      }
      
      // Ctrl/Cmd + Shift + B = Toggle Bonus Hunt
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        const bhBtn = document.getElementById('bh-btn');
        if (bhBtn) bhBtn.click();
      }
      
      // Ctrl/Cmd + Shift + R = Toggle Random Slot
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        const randomBtn = document.getElementById('random-slot-btn');
        if (randomBtn) randomBtn.click();
      }
    });
  }

  initializeTimeDisplay() {
    const updateTime = () => {
      const timeElement = document.getElementById('current-time');
      if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        timeElement.textContent = timeString;
      }
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  initializeBasicUI() {
    // Initialize any basic UI interactions that don't belong to specific modules
    
    // Escape key to close modals/panels
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
        
        // Hide suggestion boxes
        document.querySelectorAll('.slot-suggestion-box, .slot-suggestion-dropdown').forEach(box => {
          box.style.display = 'none';
        });
      }
    });

    // Click outside to close dropdowns
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.slot-suggestion-box') && !e.target.closest('input')) {
        document.querySelectorAll('.slot-suggestion-box, .slot-suggestion-dropdown').forEach(box => {
          box.style.display = 'none';
        });
      }
    });
  }

  createDraggableMedia(src, type = 'image') {
    console.log('Creating draggable media with controls:', type, 'src length:', src?.length);
    
    // Prevent creating empty containers
    if (!src || src.length === 0) {
      console.warn('Attempted to create draggable media without valid source');
      return;
    }
    
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'draggable-image-container';
    mediaContainer.style.zIndex = '1000';
    mediaContainer.style.position = 'absolute';
    mediaContainer.style.left = '100px';
    mediaContainer.style.top = '100px';
    mediaContainer.style.width = 'auto';
    mediaContainer.style.height = 'auto';
    
    // Create media element
    let mediaElement;
    if (type === 'video') {
      mediaElement = document.createElement('video');
      mediaElement.src = src;
      mediaElement.className = 'draggable-image';
      mediaElement.style.maxWidth = '600px';
      mediaElement.style.maxHeight = '400px';
      mediaElement.style.display = 'block';
      mediaElement.controls = !window.isLayoutLocked;
      mediaElement.loop = true;
      mediaElement.autoplay = true;
      mediaElement.muted = true; // Start muted for autoplay
    } else {
      mediaElement = document.createElement('img');
      mediaElement.src = src;
      mediaElement.alt = 'Uploaded Media';
      mediaElement.className = 'draggable-image';
      mediaElement.style.maxWidth = '400px';
      mediaElement.style.display = 'block';
    }
    
    // Create controls container
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'image-controls';
    controlsDiv.style.display = window.isLayoutLocked ? 'none' : 'flex';
    
    if (type === 'video') {
      controlsDiv.innerHTML = `
        <button class="layer-btn layer-up" title="Mover para frente">↑</button>
        <button class="layer-btn layer-down" title="Mover para trás">↓</button>
        <button class="layer-btn loop-btn active" title="Loop On/Off">🔁</button>
        <span class="layer-display">Layer: 1000</span>
        <button class="close-btn">×</button>
      `;
    } else {
      controlsDiv.innerHTML = `
        <button class="layer-btn layer-up" title="Mover para frente">↑</button>
        <button class="layer-btn layer-down" title="Mover para trás">↓</button>
        <span class="layer-display">Layer: 1000</span>
        <button class="close-btn">×</button>
      `;
    }
    
    // Create resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.display = window.isLayoutLocked ? 'none' : 'block';
    
    // Apply locked state to container if needed
    if (window.isLayoutLocked) {
      mediaContainer.classList.add('locked');
      mediaContainer.style.cursor = 'default';
      mediaContainer.style.border = 'none';
      mediaContainer.style.boxShadow = 'none';
      if (type === 'video') {
        mediaElement.controls = false;
      }
    }
    
    // Append elements
    mediaContainer.appendChild(mediaElement);
    mediaContainer.appendChild(controlsDiv);
    mediaContainer.appendChild(resizeHandle);
    
    document.body.appendChild(mediaContainer);
    console.log('Media container appended, type:', type, 'locked:', window.isLayoutLocked);

    // Add drag functionality
    let isDragging = false;
    let isResizing = false;
    let startX, startY, startLeft, startTop, startWidth, startHeight;

    mediaContainer.addEventListener('mousedown', (e) => {
      if (window.isLayoutLocked) return;
      
      if (e.target.classList.contains('close-btn') || 
          e.target.classList.contains('layer-btn')) return;
      
      if (e.target.classList.contains('resize-handle')) {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = mediaContainer.offsetWidth;
        startHeight = mediaContainer.offsetHeight;
        e.preventDefault();
        return;
      }
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = mediaContainer.offsetLeft;
      startTop = mediaContainer.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (window.isLayoutLocked) return;
      
      if (isResizing) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newWidth = Math.max(100, startWidth + deltaX);
        const newHeight = Math.max(100, startHeight + deltaY);
        
        mediaContainer.style.width = newWidth + 'px';
        mediaContainer.style.height = newHeight + 'px';
        
        if (mediaElement) {
          mediaElement.style.maxWidth = '100%';
          mediaElement.style.maxHeight = '100%';
          mediaElement.style.width = '100%';
          mediaElement.style.height = '100%';
          mediaElement.style.objectFit = 'contain';
        }
        return;
      }
      
      if (!isDragging) return;
      
      const newLeft = startLeft + e.clientX - startX;
      const newTop = startTop + e.clientY - startY;
      
      mediaContainer.style.left = newLeft + 'px';
      mediaContainer.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      isResizing = false;
    });

    // Layer controls
    const layerDisplay = mediaContainer.querySelector('.layer-display');
    const layerUpBtn = mediaContainer.querySelector('.layer-up');
    const layerDownBtn = mediaContainer.querySelector('.layer-down');

    layerUpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let currentZ = parseInt(mediaContainer.style.zIndex) || 1000;
      currentZ += 10;
      mediaContainer.style.zIndex = currentZ;
      layerDisplay.textContent = `Layer: ${currentZ}`;
    });

    layerDownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let currentZ = parseInt(mediaContainer.style.zIndex) || 1000;
      currentZ = Math.max(1, currentZ - 10);
      mediaContainer.style.zIndex = currentZ;
      layerDisplay.textContent = `Layer: ${currentZ}`;
    });

    // Loop button (only for videos)
    if (type === 'video') {
      const loopBtn = mediaContainer.querySelector('.loop-btn');
      loopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mediaElement.loop = !mediaElement.loop;
        loopBtn.classList.toggle('active', mediaElement.loop);
        loopBtn.style.opacity = mediaElement.loop ? '1' : '0.5';
      });
    }

    // Close button
    mediaContainer.querySelector('.close-btn').addEventListener('click', () => {
      mediaContainer.remove();
    });
  }

  initializeSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    let isOpen = false;

    console.log('Initializing sidebar toggle - Sidebar found:', !!sidebar, 'Toggle found:', !!sidebarToggle);

    // Force sidebar to closed state on load
    if (sidebar) {
      sidebar.classList.remove('open');
      const buttons = sidebar.querySelectorAll('.sidebar-btn');
      buttons.forEach(btn => {
        btn.style.opacity = '0';
        btn.style.scale = '0';
        btn.style.pointerEvents = 'none';
      });
    }
    
    if (sidebarToggle) {
      sidebarToggle.classList.remove('active');
      
      // Style the main button
      sidebarToggle.style.cssText = `
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 10000 !important;
        width: 50px !important;
        height: 50px !important;
        background: none !important;
        border: none !important;
        box-shadow: none !important;
        position: relative !important;
        cursor: pointer !important;
        animation: spin 3s linear infinite !important;
      `;
      
      // Add the main circle image if not present
      if (!sidebarToggle.innerHTML.trim()) {
        sidebarToggle.innerHTML = '<img src="./assets/maincircle.png" alt="Main" style="width: 50px; height: 50px; display: block;">';
      }
      
      console.log('Main button styled and ready');
    }

    if (sidebarToggle && sidebar) {
      // Toggle sidebar on main button click
      sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSidebar(sidebar, sidebarToggle, isOpen);
        isOpen = !isOpen;
      });

      // Close sidebar when clicking outside
      document.addEventListener('click', (e) => {
        if (isOpen && !sidebar.contains(e.target)) {
          this.closeSidebar(sidebar, sidebarToggle);
          isOpen = false;
        }
      });

      // Prevent sidebar from closing when clicking on fan buttons
      sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Add click handlers for individual buttons to close sidebar after action
      const sidebarButtons = sidebar.querySelectorAll('.sidebar-btn');
      sidebarButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Small delay to allow the button action to complete
          setTimeout(() => {
            this.closeSidebar(sidebar, sidebarToggle);
            isOpen = false;
          }, 300);
        });
      });
    }
  }

  toggleSidebar(sidebar, sidebarToggle, isCurrentlyOpen) {
    if (isCurrentlyOpen) {
      this.closeSidebar(sidebar, sidebarToggle);
    } else {
      this.openSidebar(sidebar, sidebarToggle);
    }
  }

  openSidebar(sidebar, sidebarToggle) {
    sidebar.classList.add('open');
    sidebarToggle.classList.add('active');
    
    // Apply no-background class if backgrounds are disabled
    const buttons = sidebar.querySelectorAll('.sidebar-btn');
    const sidebarBackgroundsEnabled = localStorage.getItem('sidebarBackgroundsEnabled') !== 'false';
    
    buttons.forEach((btn, index) => {
      btn.style.animationDelay = `${index * 0.1}s`;
      
      if (!sidebarBackgroundsEnabled) {
        btn.classList.add('no-background');
      } else {
        btn.classList.remove('no-background');
      }
    });
  }

  setupNavbarSwitcher() {
    console.log('🔄 Setting up navbar image switcher...');
    
    // Define the three images to switch between
    const navbarModes = [
      { src: "./assets/content.png", alt: "Content", description: "Content Display" },
      { src: "./assets/raw.png", alt: "Raw", description: "Raw Display" },
      { src: "./assets/wager.png", alt: "Wager", description: "Wager Display" }
    ];
    let navbarModeIndex = 0;
    
    const navbarSwitcher = document.getElementById('navbar-image-switcher');
    const switcherImage = document.getElementById('switcher-image');
    
    if (!navbarSwitcher || !switcherImage) {
      console.warn('⚠️ Navbar switcher elements not found');
      return;
    }
    
    console.log('✅ Navbar switcher elements found');

    const updateNavbarSwitcher = () => {
      const currentMode = navbarModes[navbarModeIndex];
      console.log('🔄 Updating navbar switcher to:', currentMode.description);
      
      // Set error handler
      switcherImage.onerror = function() {
        console.warn('⚠️ Failed to load image:', currentMode.src);
        this.src = './assets/content.png'; // Fallback to content.png
      };
      
      // Set load handler with smooth transition effect
      switcherImage.onload = function() {
        console.log('✅ Image loaded successfully:', currentMode.src);
        // Add smooth scale animation
        this.style.transition = 'transform 0.2s ease';
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 200);
      };
      
      // Update image source and properties
      switcherImage.src = currentMode.src;
      switcherImage.alt = currentMode.alt;
      navbarSwitcher.title = `Click to switch - Current: ${currentMode.description}`;
      
      // Ensure visibility
      navbarSwitcher.style.display = 'inline-block';
      navbarSwitcher.style.visibility = 'visible';
      navbarSwitcher.style.opacity = '1';
      switcherImage.style.display = 'block';
    };

    // Handle clicks on the switcher container
    navbarSwitcher.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🖱️ Navbar switcher clicked! Current index:', navbarModeIndex);
      
      // Cycle to next image
      navbarModeIndex = (navbarModeIndex + 1) % navbarModes.length;
      const newMode = navbarModes[navbarModeIndex];
      console.log('➡️ New index:', navbarModeIndex, 'New mode:', newMode.description);
      
      updateNavbarSwitcher();
    });
    
    // Initialize with first image
    updateNavbarSwitcher();
    console.log('✅ Navbar switcher initialized successfully');
  }

  setupTwitchChat() {
    console.log('💬 Setting up Twitch chat functionality...');
    
    const twitchChannelInput = document.getElementById('twitch-channel-input');
    const twitchChatTheme = document.getElementById('twitch-chat-theme');
    const loadChatBtn = document.getElementById('load-twitch-chat');
    const clearChatBtn = document.getElementById('clear-twitch-chat');
    
    if (!loadChatBtn) {
      console.warn('⚠️ Twitch chat buttons not found');
      return;
    }

    const loadTwitchChat = () => {
      const channelName = twitchChannelInput?.value?.trim();
      const theme = twitchChatTheme?.value || 'dark';
      
      if (!channelName) {
        alert('Please enter a Twitch channel name');
        return;
      }
      
      // Validate channel name (basic validation)
      if (!/^[a-zA-Z0-9_]{3,25}$/.test(channelName)) {
        alert('Invalid channel name. Use only letters, numbers, and underscores (3-25 characters)');
        return;
      }
      
      const chatIframe = document.getElementById('twitch-chat-iframe');
      const emptyChatCard = document.getElementById('empty-chat-card');
      
      if (chatIframe && emptyChatCard) {
        // Show loading state
        emptyChatCard.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af;">Connecting to Twitch...</div>';
        emptyChatCard.style.display = 'flex';
        loadChatBtn.textContent = 'Loading...';
        loadChatBtn.disabled = true;
        
        // Build Twitch chat embed URL
        let hostname = window.location.hostname || 'localhost';
        
        // Handle localhost and development environments
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
        
        let chatUrl;
        if (isLocalhost) {
          chatUrl = `https://www.twitch.tv/embed/${channelName}/chat?${theme}popout&parent=localhost`;
        } else {
          chatUrl = `https://www.twitch.tv/embed/${channelName}/chat?${theme}popout&parent=${hostname}`;
        }
        
        setTimeout(() => {
          chatIframe.src = chatUrl;
          chatIframe.style.display = 'block';
          emptyChatCard.style.display = 'none';
          loadChatBtn.textContent = 'Load Chat';
          loadChatBtn.disabled = false;
          
          // Save to localStorage
          localStorage.setItem('twitchChannelName', channelName);
          localStorage.setItem('twitchChatTheme', theme);
          
          console.log('✅ Twitch chat loaded for channel:', channelName);
        }, 500);
      }
    };

    const clearTwitchChat = () => {
      const chatIframe = document.getElementById('twitch-chat-iframe');
      const emptyChatCard = document.getElementById('empty-chat-card');
      
      if (chatIframe && emptyChatCard) {
        chatIframe.src = '';
        chatIframe.style.display = 'none';
        emptyChatCard.style.display = 'flex';
        emptyChatCard.innerHTML = '';
        
        // Clear localStorage
        localStorage.removeItem('twitchChannelName');
        localStorage.removeItem('twitchChatTheme');
        
        console.log('🗑️ Twitch chat cleared');
      }
    };

    // Event listeners
    loadChatBtn.addEventListener('click', loadTwitchChat);
    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', clearTwitchChat);
    }

    // Load saved channel on startup
    const savedChannel = localStorage.getItem('twitchChannelName');
    const savedTheme = localStorage.getItem('twitchChatTheme');
    
    if (savedChannel && twitchChannelInput) {
      twitchChannelInput.value = savedChannel;
      if (savedTheme && twitchChatTheme) {
        twitchChatTheme.value = savedTheme;
      }
      // Auto-load the saved chat
      setTimeout(() => loadTwitchChat(), 1000);
    }
    
    console.log('✅ Twitch chat functionality initialized');
  }

  showNotification(message, duration = 2000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'navbar-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #9346ff, #00e1ff);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  closeSidebar(sidebar, sidebarToggle) {
    sidebar.classList.remove('open');
    sidebarToggle.classList.remove('active');
    
    // Reset animation delays
    const buttons = sidebar.querySelectorAll('.sidebar-btn');
    buttons.forEach((btn) => {
      btn.style.animationDelay = '';
    });
  }

  // Public API methods
  getModule(name) {
    return this.modules[name];
  }

  isModuleLoaded(name) {
    return !!this.modules[name];
  }
}

// Initialize the application
const app = new StreamerOverlayApp();

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Make app globally accessible
window.streamerApp = app;