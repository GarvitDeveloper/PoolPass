// Admin functionality for PoolPass

const Admin = {
    // Current admin section
    currentSection: null,

    // Initialize admin functionality
    init() {
        this.setupAdminSections();
        this.setupEventListeners();
    },

    // Setup admin sections
    setupAdminSections() {
        // Create admin section containers
        this.createAdminSections();
    },

    // Create admin section containers
    createAdminSections() {
        const adminScreen = document.getElementById('adminScreen');
        if (!adminScreen) return;

        // Add section containers after admin actions
        const adminActions = adminScreen.querySelector('.admin-actions');
        if (adminActions) {
            adminActions.insertAdjacentHTML('afterend', `
                <div id="statusSection" class="admin-section">
                    <h3>Pool Status Management</h3>
                    <div class="status-controls">
                        <button class="status-btn open" onclick="Admin.setPoolStatus('open')">
                            <span>🏊‍♂️</span> Set Open
                        </button>
                        <button class="status-btn closed" onclick="Admin.setPoolStatus('closed')">
                            <span>🚫</span> Set Closed
                        </button>
                        <button class="status-btn warning" onclick="Admin.setPoolStatus('warning')">
                            <span>⚠️</span> Set Warning
                        </button>
                    </div>
                    <div class="status-form">
                        <label for="statusMessage">Status Message (optional):</label>
                        <input type="text" id="statusMessage" placeholder="e.g., Closed for cleaning">
                        <button onclick="Admin.updateStatusMessage()">Update Message</button>
                    </div>
                </div>

                <div id="incidentsSection" class="admin-section">
                    <h3>Incident Logging</h3>
                    <div class="incident-form">
                        <div class="form-group">
                            <label for="incidentDescription">Incident Description:</label>
                            <textarea id="incidentDescription" placeholder="Describe the incident..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="incidentAuthor">Your Name/Initials:</label>
                            <input type="text" id="incidentAuthor" placeholder="Optional">
                        </div>
                        <button onclick="Admin.logIncident()">Log Incident</button>
                    </div>
                    <div class="incident-list" id="incidentList"></div>
                </div>



                <div id="noticesSection" class="admin-section">
                    <h3>Notice Management</h3>
                    <div class="notice-form">
                        <label for="newNotice">New Notice:</label>
                        <textarea id="newNotice" placeholder="Enter notice text..."></textarea>
                        <button onclick="Admin.addNotice()">Add Notice</button>
                    </div>
                    <div class="notices-list" id="adminNoticesList"></div>
                </div>

                <div id="occupancySection" class="admin-section">
                    <h3>Occupancy Management</h3>
                    <div class="occupancy-controls">
                        <div class="occupancy-input">
                            <button class="occupancy-btn" onclick="Admin.adjustOccupancy(-1)">-</button>
                            <input type="number" id="occupancyInput" min="0" max="100">
                            <button class="occupancy-btn" onclick="Admin.adjustOccupancy(1)">+</button>
                        </div>
                        <button onclick="Admin.setOccupancy()">Set Occupancy</button>
                        <button onclick="Admin.resetOccupancy()">Reset to 0</button>
                    </div>
                    
                    <div class="checkout-section">
                        <h4>Check Out Residents</h4>
                        <div class="checkout-list" id="checkoutList">
                            <p>No one currently checked in</p>
                        </div>
                    </div>
                </div>
            `);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Setup occupancy input
        const occupancyInput = document.getElementById('occupancyInput');
        if (occupancyInput) {
            occupancyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    Admin.setOccupancy();
                }
            });
        }

        // Setup status message input
        const statusMessageInput = document.getElementById('statusMessage');
        if (statusMessageInput) {
            statusMessageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    Admin.updateStatusMessage();
                }
            });
        }
    },

    // Setup admin panel
    setupAdminPanel() {
        // Update admin activity
        App.updateAdminActivity();
        
        // Load current data
        this.loadIncidents();
        this.loadNotices();
        this.updateOccupancyInput();
    },

    // Show admin section
    showAdminSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId + 'Section');
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Load section-specific data
            this.loadSectionData(sectionId);
        }
    },

    // Load section-specific data
    loadSectionData(sectionId) {
        switch (sectionId) {
            case 'status':
                this.loadStatusData();
                break;
            case 'incidents':
                this.loadIncidents();
                break;
            case 'qr':
                this.loadQRData();
                break;
            case 'notices':
                this.loadNotices();
                break;
            case 'occupancy':
                this.updateOccupancyInput();
                break;
        }
    },

    // Load status data
    loadStatusData() {
        const currentStatus = localStorage.getItem('poolStatus') || 'open';
        const statusMessage = localStorage.getItem('poolStatusMessage') || '';
        
        const statusMessageInput = document.getElementById('statusMessage');
        if (statusMessageInput) {
            statusMessageInput.value = statusMessage;
        }
    },

    // Set pool status
    setPoolStatus(status) {
        try {
            localStorage.setItem('poolStatus', status);
            App.updateStatusIndicator();
            
            const statusMessages = {
                open: 'Pool is now open',
                closed: 'Pool is now closed',
                warning: 'Warning status set'
            };
            
            Utils.showToast(statusMessages[status], 'success');
            
            // Update admin activity
            App.updateAdminActivity();
            
        } catch (error) {
            console.error('Failed to set pool status:', error);
            Utils.showToast('Failed to set pool status', 'error');
        }
    },

    // Update status message
    updateStatusMessage() {
        const messageInput = document.getElementById('statusMessage');
        if (!messageInput) return;

        const message = messageInput.value.trim();
        localStorage.setItem('poolStatusMessage', message);
        
        Utils.showToast('Status message updated', 'success');
        App.updateAdminActivity();
    },

    // Load incidents
    loadIncidents() {
        const incidents = Storage.getIncidents();
        const container = document.getElementById('incidentList');
        
        if (!container) return;

        if (!incidents || incidents.incidents.length === 0) {
            container.innerHTML = '<p>No incidents logged</p>';
            return;
        }

        container.innerHTML = incidents.incidents.map(incident => `
            <div class="incident-item">
                <div class="incident-date">${incident.timestamp}</div>
                <div class="incident-description">${incident.description}</div>
                ${incident.author ? `<div class="incident-author">- ${incident.author}</div>` : ''}
            </div>
        `).join('');
    },

    // Log incident
    async logIncident() {
        try {
            const descriptionInput = document.getElementById('incidentDescription');
            const authorInput = document.getElementById('incidentAuthor');
            
            if (!descriptionInput) return;

            const description = descriptionInput.value.trim();
            const author = authorInput ? authorInput.value.trim() : '';

            if (!description) {
                Utils.showToast('Please enter incident description', 'error');
                return;
            }

            const incident = {
                description: Utils.sanitizeText(description),
                author: Utils.sanitizeText(author)
            };

            await Storage.addIncident(incident);
            
            // Clear form
            descriptionInput.value = '';
            if (authorInput) authorInput.value = '';
            
            // Reload incidents
            this.loadIncidents();
            
            Utils.showToast('Incident logged successfully', 'success');
            App.updateAdminActivity();
            
        } catch (error) {
            console.error('Failed to log incident:', error);
            Utils.showToast('Failed to log incident', 'error');
        }
    },

    // Load notices
    loadNotices() {
        const notices = Storage.getNotices();
        const container = document.getElementById('adminNoticesList');
        
        if (!container) return;

        if (!notices || notices.currentNotices.length === 0) {
            container.innerHTML = '<p>No current notices</p>';
            return;
        }

        container.innerHTML = notices.currentNotices.map((notice, index) => `
            <div class="notice-item">
                <div class="notice-text">${notice.text}</div>
                <div class="notice-date">${notice.date}</div>
                <button onclick="Admin.removeNotice(${index})" class="remove-btn">Remove</button>
            </div>
        `).join('');
    },

    // Add notice
    async addNotice() {
        try {
            const noticeInput = document.getElementById('newNotice');
            if (!noticeInput) return;

            const text = noticeInput.value.trim();
            if (!text) {
                Utils.showToast('Please enter notice text', 'error');
                return;
            }

            const notices = Storage.getNotices();
            if (!notices) return;

            const newNotice = {
                text: Utils.sanitizeText(text),
                date: Utils.formatDateTime()
            };

            notices.currentNotices.unshift(newNotice);
            await Storage.updateNotices(notices);
            
            // Clear form
            noticeInput.value = '';
            
            // Reload notices
            this.loadNotices();
            
            // Update home screen notice banner
            App.updateNoticeBanner();
            
            Utils.showToast('Notice added successfully', 'success');
            App.updateAdminActivity();
            
        } catch (error) {
            console.error('Failed to add notice:', error);
            Utils.showToast('Failed to add notice', 'error');
        }
    },

    // Remove notice
    async removeNotice(index) {
        try {
            Utils.showConfirm(
                'Are you sure you want to remove this notice?',
                async () => {
                    const notices = Storage.getNotices();
                    if (!notices) return;

                    notices.currentNotices.splice(index, 1);
                    await Storage.updateNotices(notices);
                    
                    this.loadNotices();
                    App.updateNoticeBanner();
                    
                    Utils.showToast('Notice removed', 'success');
                    App.updateAdminActivity();
                }
            );
        } catch (error) {
            console.error('Failed to remove notice:', error);
            Utils.showToast('Failed to remove notice', 'error');
        }
    },

    // Load QR data
    loadQRData() {
        // QR code will be generated on demand
    },

    // Generate QR code
    async generateQRCode() {
        try {
            // Use the QRGenerator module
            if (typeof QRGenerator !== 'undefined') {
                return await QRGenerator.generateQRCode();
            } else {
                // Fallback to simple placeholder
                const qrContainer = document.getElementById('qrCode');
                if (!qrContainer) return;

                // Generate a unique URL for the pool
                const poolUrl = `${window.location.origin}${window.location.pathname}?pool=${Utils.randomString(8)}`;
                
                // Create QR code placeholder
                qrContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="width: 200px; height: 200px; background: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 2px solid #ccc;">
                            <span style="font-size: 3rem;">📱</span>
                        </div>
                        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">QR Code Placeholder</p>
                        <p style="font-size: 0.8rem; color: #999;">${poolUrl}</p>
                        <p style="font-size: 0.8rem; color: #f56565;">QR library not available</p>
                    </div>
                `;

                // Store the URL for download/copy
                qrContainer.dataset.url = poolUrl;
                
                Utils.showToast('QR Code placeholder generated', 'info');
                App.updateAdminActivity();
            }
            
        } catch (error) {
            console.error('Failed to generate QR code:', error);
            Utils.showToast('Failed to generate QR code', 'error');
        }
    },

    // Download QR code
    async downloadQRCode() {
        try {
            // Use the QRGenerator module if available
            if (typeof QRGenerator !== 'undefined' && QRGenerator.currentQRData) {
                return await QRGenerator.downloadQRCode();
            } else {
                // Fallback for placeholder QR codes
                const qrContainer = document.getElementById('qrCode');
                if (!qrContainer || !qrContainer.dataset.url) {
                    Utils.showToast('Generate a QR code first', 'error');
                    return;
                }

                // Create a simple text file with the URL
                const content = `Pool QR Code URL: ${qrContainer.dataset.url}\nGenerated: ${Utils.formatDateTime()}`;
                Utils.downloadFile(content, 'pool_qr_url.txt', 'text/plain');
                Utils.showToast('QR URL downloaded as text file', 'success');
            }
        } catch (error) {
            console.error('Failed to download QR code:', error);
            Utils.showToast('Failed to download QR code', 'error');
        }
    },

    // Copy QR code URL
    copyQRCode() {
        try {
            // Use the QRGenerator module if available
            if (typeof QRGenerator !== 'undefined' && QRGenerator.currentQRData) {
                return QRGenerator.copyQRCodeURL();
            } else {
                // Fallback for placeholder QR codes
                const qrContainer = document.getElementById('qrCode');
                if (!qrContainer || !qrContainer.dataset.url) {
                    Utils.showToast('Generate a QR code first', 'error');
                    return;
                }

                Utils.copyToClipboard(qrContainer.dataset.url);
            }
        } catch (error) {
            console.error('Failed to copy QR code URL:', error);
            Utils.showToast('Failed to copy QR code URL', 'error');
        }
    },

    // Update occupancy input
    updateOccupancyInput() {
        const occupancy = Storage.getOccupancy();
        const input = document.getElementById('occupancyInput');
        const checkoutList = document.getElementById('checkoutList');
        
        if (input && occupancy) {
            input.value = occupancy.currentCount;
        }

        // Update checkout list
        if (checkoutList && occupancy) {
            const currentlyCheckedIn = occupancy.currentlyCheckedIn || [];
            
            if (currentlyCheckedIn.length === 0) {
                checkoutList.innerHTML = '<p>No one currently checked in</p>';
            } else {
                checkoutList.innerHTML = currentlyCheckedIn.map(person => `
                    <div class="checkout-item">
                        <div class="checkout-info">
                            <div class="checkout-name">${person.name}</div>
                            <div class="checkout-id">${person.id}</div>
                            <div class="checkout-time">Checked in: ${person.checkinTime}</div>
                        </div>
                        <button class="checkout-btn" onclick="Admin.checkoutResident('${person.id}')">Check Out</button>
                    </div>
                `).join('');
            }
        }
    },

    // Adjust occupancy
    adjustOccupancy(change) {
        const input = document.getElementById('occupancyInput');
        if (!input) return;

        const currentValue = parseInt(input.value) || 0;
        const newValue = Math.max(0, currentValue + change);
        input.value = newValue;
    },

    // Set occupancy
    async setOccupancy() {
        const input = document.getElementById('occupancyInput');
        if (!input) return;

        const newCount = parseInt(input.value) || 0;
        await Checkin.adjustOccupancy(newCount);
    },

    // Reset occupancy
    async resetOccupancy() {
        await Checkin.resetOccupancy();
        this.updateOccupancyInput();
    },

    // Check out resident
    async checkoutResident(poolPassId) {
        try {
            Utils.showConfirm(
                'Are you sure you want to check out this resident?',
                async () => {
                    const occupancy = Storage.getOccupancy();
                    if (!occupancy) {
                        throw new Error('Unable to load occupancy data');
                    }

                    // Find the resident to check out
                    const resident = occupancy.currentlyCheckedIn.find(r => r.id === poolPassId);
                    if (!resident) {
                        Utils.showToast('Resident not found', 'error');
                        return;
                    }

                    // Remove from currently checked in
                    const currentlyCheckedIn = occupancy.currentlyCheckedIn.filter(r => r.id !== poolPassId);
                    
                    // Update occupancy count (resident + guests)
                    const totalPeople = 1 + resident.guests;
                    const newCount = Math.max(0, occupancy.currentCount - totalPeople);

                    // Update occupancy data
                    await Storage.updateOccupancy({
                        currentCount: newCount,
                        currentlyCheckedIn: currentlyCheckedIn
                    });

                    // Update UI
                    App.updateOccupancyDisplay();
                    this.updateOccupancyInput();

                    Utils.showToast(`${resident.name} checked out successfully`, 'success');
                    App.updateAdminActivity();
                }
            );
        } catch (error) {
            console.error('Failed to check out resident:', error);
            Utils.showToast('Failed to check out resident', 'error');
        }
    },

    // Export admin data
    exportAdminData() {
        try {
            const data = {
                exportDate: Utils.formatDateTime(),
                incidents: Storage.getIncidents(),
                notices: Storage.getNotices(),
                occupancy: Storage.getOccupancy(),
                settings: Storage.getSettings()
            };

            const filename = `admin_data_${Utils.getCurrentDateString()}.json`;
            Utils.downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
            Utils.showToast('Admin data exported', 'success');
        } catch (error) {
            console.error('Failed to export admin data:', error);
            Utils.showToast('Failed to export admin data', 'error');
        }
    },

    // Get admin statistics
    getAdminStats() {
        const stats = Storage.getStats();
        const incidents = Storage.getIncidents();
        const notices = Storage.getNotices();
        
        return {
            ...stats,
            totalIncidents: incidents ? incidents.incidents.length : 0,
            activeNotices: notices ? notices.currentNotices.length : 0,
            poolStatus: localStorage.getItem('poolStatus') || 'open'
        };
    }
};

// Initialize admin when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
});

// Global functions for HTML onclick handlers
function showAdminSection(sectionId) {
    Admin.showAdminSection(sectionId);
} 