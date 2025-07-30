// Main application logic for PoolPass

const App = {
    // Current screen state
    currentScreen: 'homeScreen',
    
    // Admin session state
    adminSession: {
        isAuthenticated: false,
        lastActivity: null,
        timeout: null
    },

    // Initialize the application
    async init() {
        try {
            // Wait for storage to be ready
            await Storage.init();
            
            // Initialize UI
            this.initUI();
            
            // Load initial data
            await this.loadInitialData();
            
            // Start auto backup
            Storage.startAutoBackup();
            
            // Set up admin session timeout
            this.setupAdminTimeout();
            
            console.log('PoolPass app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            Utils.showToast('Failed to initialize app', 'error');
        }
    },

    // Initialize UI elements
    initUI() {
        // Set up screen navigation
        this.setupScreenNavigation();
        
        // Set up admin modal
        this.setupAdminModal();
        
        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Set up touch events for mobile
        if (Utils.isTouchDevice()) {
            this.setupTouchEvents();
        }
    },

    // Load initial data and update UI
    async loadInitialData() {
        try {
            // Update occupancy display
            this.updateOccupancyDisplay();
            
            // Update status indicator
            this.updateStatusIndicator();
            
            // Update notice banner
            this.updateNoticeBanner();
            
            // Load rules and notices
            this.loadRulesAndNotices();
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    },

    // Screen navigation
    showScreen(screenId) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // Update page title
            this.updatePageTitle(screenId);
            
            // Load screen-specific data
            this.loadScreenData(screenId);
        }
    },

    // Load data specific to each screen
    loadScreenData(screenId) {
        switch (screenId) {
            case 'homeScreen':
                this.updateHomeScreen();
                break;
            case 'checkinScreen':
                this.setupCheckinForm();
                break;
            case 'rulesScreen':
                this.loadRulesAndNotices();
                break;
            case 'adminScreen':
                this.setupAdminPanel();
                break;
        }
    },

    // Update home screen data
    updateHomeScreen() {
        this.updateOccupancyDisplay();
        this.updateStatusIndicator();
        this.updateNoticeBanner();
    },

    // Update occupancy display
    updateOccupancyDisplay() {
        const occupancy = Storage.getOccupancy();
        const countElement = document.getElementById('occupancyCount');
        const checkedInList = document.getElementById('checkedInList');
        
        if (occupancy && countElement) {
            countElement.textContent = occupancy.currentCount;
            
            // Add visual feedback for high occupancy
            if (occupancy.currentCount >= occupancy.maxCount * 0.8) {
                countElement.style.color = '#ed8936'; // Orange for high occupancy
            } else if (occupancy.currentCount >= occupancy.maxCount) {
                countElement.style.color = '#f56565'; // Red for at capacity
            } else {
                countElement.style.color = '#2d3748'; // Default color
            }
        }

        // Update currently checked in list
        if (checkedInList && occupancy) {
            const currentlyCheckedIn = occupancy.currentlyCheckedIn || [];
            
            if (currentlyCheckedIn.length === 0) {
                checkedInList.innerHTML = '<p class="no-checkins">No one currently checked in</p>';
            } else {
                checkedInList.innerHTML = currentlyCheckedIn.map(person => `
                    <div class="checked-in-item">
                        <div class="checked-in-info">
                            <div class="checked-in-name">${person.name}</div>
                            <div class="checked-in-id">${person.id}</div>
                            <div class="checked-in-time">Checked in: ${person.checkinTime}</div>
                        </div>
                        ${person.guests > 0 ? `<div class="checked-in-guests">+${person.guests} guests</div>` : ''}
                    </div>
                `).join('');
            }
        }
    },

    // Update status indicator
    updateStatusIndicator() {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (!statusIndicator || !statusText) return;

        // Get current status from storage (would be set by admin)
        const status = localStorage.getItem('poolStatus') || 'open';
        
        // Update classes and text
        statusIndicator.className = 'status-indicator ' + status;
        
        switch (status) {
            case 'closed':
                statusText.textContent = 'Closed';
                break;
            case 'warning':
                statusText.textContent = 'Warning';
                break;
            default:
                statusText.textContent = 'Open';
        }
    },

    // Update notice banner
    updateNoticeBanner() {
        const banner = document.getElementById('noticeBanner');
        const noticeText = document.getElementById('noticeText');
        
        if (!banner || !noticeText) return;

        // Get current notice from storage
        const notices = Storage.getNotices();
        const currentNotices = notices ? notices.currentNotices : [];
        
        if (currentNotices.length > 0) {
            // Show the most recent notice
            const latestNotice = currentNotices[0];
            noticeText.textContent = latestNotice.text;
            banner.style.display = 'block';
        } else {
            banner.style.display = 'none';
        }
    },

    // Load rules and notices
    loadRulesAndNotices() {
        const notices = Storage.getNotices();
        if (!notices) return;

        // Load pool rules
        const rulesContainer = document.getElementById('poolRules');
        if (rulesContainer) {
            rulesContainer.innerHTML = notices.rules.map(rule => 
                `<li>${rule}</li>`
            ).join('');
        }

        // Load current notices
        const noticesContainer = document.getElementById('currentNotices');
        if (noticesContainer) {
            if (notices.currentNotices.length > 0) {
                noticesContainer.innerHTML = notices.currentNotices.map(notice => 
                    `<div class="notice-item">
                        <div class="notice-text">${notice.text}</div>
                        <div class="notice-date">${notice.date}</div>
                    </div>`
                ).join('');
            } else {
                noticesContainer.innerHTML = '<p>No current notices</p>';
            }
        }
    },

    // Setup screen navigation
    setupScreenNavigation() {
        // Back button functionality is handled in HTML onclick
        // Additional navigation logic can be added here
    },

    // Setup admin modal
    setupAdminModal() {
        const modal = document.getElementById('adminModal');
        const pinInput = document.getElementById('adminPin');
        
        if (pinInput) {
            // Auto-submit on 4 digits
            pinInput.addEventListener('input', (e) => {
                if (e.target.value.length === 4) {
                    this.verifyAdminPin();
                }
            });

            // Enter key to submit
            pinInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.verifyAdminPin();
                }
            });
        }
    },

    // Show admin panel (with PIN verification)
    showAdminPanel() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.style.display = 'block';
            document.getElementById('adminPin').focus();
        }
    },

    // Verify admin PIN
    verifyAdminPin() {
        const pinInput = document.getElementById('adminPin');
        const enteredPin = pinInput.value;
        
        const settings = Storage.getSettings();
        const correctPin = settings ? settings.adminPin : '1234';
        
        if (enteredPin === correctPin) {
            this.adminSession.isAuthenticated = true;
            this.adminSession.lastActivity = Date.now();
            
            // Close modal and show admin screen
            this.closeAdminModal();
            this.showScreen('adminScreen');
            
            // Reset PIN input
            pinInput.value = '';
            
            Utils.showToast('Admin access granted', 'success');
        } else {
            Utils.showToast('Incorrect PIN', 'error');
            pinInput.value = '';
            pinInput.focus();
        }
    },

    // Close admin modal
    closeAdminModal() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Setup admin timeout
    setupAdminTimeout() {
        const settings = Storage.getSettings();
        const timeout = settings ? settings.sessionTimeout : 300000; // 5 minutes
        
        setInterval(() => {
            if (this.adminSession.isAuthenticated) {
                const timeSinceActivity = Date.now() - this.adminSession.lastActivity;
                if (timeSinceActivity > timeout) {
                    this.logoutAdmin();
                }
            }
        }, 60000); // Check every minute
    },

    // Logout admin
    logoutAdmin() {
        this.adminSession.isAuthenticated = false;
        this.adminSession.lastActivity = null;
        
        // Return to home screen if on admin screen
        if (this.currentScreen === 'adminScreen') {
            this.showScreen('homeScreen');
        }
        
        Utils.showToast('Admin session expired', 'info');
    },

    // Update admin activity
    updateAdminActivity() {
        if (this.adminSession.isAuthenticated) {
            this.adminSession.lastActivity = Date.now();
        }
    },

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape key to go back or close modals
            if (e.key === 'Escape') {
                if (this.currentScreen !== 'homeScreen') {
                    this.showScreen('homeScreen');
                } else {
                    this.closeAdminModal();
                }
            }
            
            // Number keys for quick navigation (if needed)
            if (e.key >= '1' && e.key <= '3' && this.currentScreen === 'homeScreen') {
                const screens = ['checkinScreen', 'rulesScreen', 'adminScreen'];
                const screenIndex = parseInt(e.key) - 1;
                if (screens[screenIndex]) {
                    this.showScreen(screens[screenIndex]);
                }
            }
        });
    },

    // Setup touch events for mobile
    setupTouchEvents() {
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', () => {
                button.style.transform = '';
            });
        });
    },

    // Update page title
    updatePageTitle(screenId) {
        const titles = {
            'homeScreen': 'PoolPass - Home',
            'checkinScreen': 'PoolPass - Check In',
            'rulesScreen': 'PoolPass - Rules & Notices',
            'adminScreen': 'PoolPass - Admin Panel'
        };
        
        document.title = titles[screenId] || 'PoolPass';
    },

    // Refresh all data
    async refreshData() {
        try {
            await Storage.loadAllData();
            this.loadInitialData();
            Utils.showToast('Data refreshed', 'success');
        } catch (error) {
            console.error('Failed to refresh data:', error);
            Utils.showToast('Failed to refresh data', 'error');
        }
    },

    // Get app statistics
    getAppStats() {
        return Storage.getStats();
    },

    // Check if pool is open
    isPoolOpen() {
        return Utils.isWithinPoolHours();
    },

    // Handle app errors
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        Utils.showToast(`Error: ${error.message}`, 'error');
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Global functions for HTML onclick handlers
function showScreen(screenId) {
    App.showScreen(screenId);
}

function showAdminPanel() {
    App.showAdminPanel();
}

function verifyAdminPin() {
    App.verifyAdminPin();
}

function closeAdminModal() {
    App.closeAdminModal();
} 