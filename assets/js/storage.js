// Storage management for PoolPass app
// Handles local JSON file operations and data persistence

const Storage = {
    // Cache for loaded data
    cache: {},

    // Initialize storage system
    async init() {
        try {
            // Load all data files
            await this.loadAllData();
            console.log('Storage initialized successfully');
        } catch (error) {
            console.error('Failed to initialize storage:', error);
            // Create default data if files don't exist
            await this.createDefaultData();
        }
    },

    // Load all data files
    async loadAllData() {
        const dataFiles = [
            'settings.json',
            'residents.json', 
            'occupancy.json',
            'notices.json',
            'incidents.json'
        ];

        for (const file of dataFiles) {
            await this.loadData(file);
        }
    },

    // Load data from JSON file
    async loadData(filename) {
        try {
            const response = await fetch(`data/${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.cache[filename] = data;
            return data;
        } catch (error) {
            console.error(`Failed to load ${filename}:`, error);
            throw error;
        }
    },

    // Save data to JSON file (simulated - in real app would use server)
    async saveData(filename, data) {
        try {
            // In a real implementation, this would send data to a server
            // For now, we'll simulate by updating cache and localStorage
            this.cache[filename] = data;
            
            // Store in localStorage as backup
            localStorage.setItem(`poolpass_${filename}`, JSON.stringify(data));
            
            // Simulate server save delay
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log(`Data saved to ${filename}`);
            return true;
        } catch (error) {
            console.error(`Failed to save ${filename}:`, error);
            throw error;
        }
    },

    // Get data from cache
    getData(filename) {
        return this.cache[filename] || null;
    },

    // Update specific data
    async updateData(filename, updates) {
        try {
            const currentData = this.getData(filename);
            if (!currentData) {
                throw new Error(`No data found for ${filename}`);
            }

            // Merge updates with current data
            const updatedData = { ...currentData, ...updates };
            
            // Add timestamp
            updatedData.lastUpdated = Utils.formatDateTime();
            
            await this.saveData(filename, updatedData);
            return updatedData;
        } catch (error) {
            console.error(`Failed to update ${filename}:`, error);
            throw error;
        }
    },

    // Create default data files
    async createDefaultData() {
        const defaultData = {
            'settings.json': {
                adminPin: "1234",
                maxOccupancy: 50,
                maxGuestsPerResident: 5,
                sessionTimeout: 300000,
                autoBackup: true,
                backupInterval: 3600000,
                poolName: "Community Pool",
                poolHours: {
                    open: "06:00",
                    close: "22:00"
                },
                features: {
                    qrGenerator: true,
                    incidentLogging: true,
                    noticeManagement: true,
                    occupancyTracking: true
                }
            },
            'residents.json': {
                residents: [
                    { "id": "PP001", "name": "John Smith" },
                    { "id": "PP002", "name": "Sarah Johnson" },
                    { "id": "PP003", "name": "Michael Davis" },
                    { "id": "PP004", "name": "Emily Wilson" },
                    { "id": "PP005", "name": "David Brown" },
                    { "id": "PP006", "name": "Lisa Anderson" },
                    { "id": "PP007", "name": "Robert Taylor" },
                    { "id": "PP008", "name": "Jennifer Martinez" }
                ]
            },
            'occupancy.json': {
                currentCount: 0,
                maxCount: 50,
                currentlyCheckedIn: [],
                today: {
                    date: Utils.getCurrentDateString(),
                    totalCheckins: 0,
                    peakOccupancy: 0,
                    checkins: []
                },
                history: []
            },
            'notices.json': {
                rules: [
                    "No running or diving in shallow end",
                    "Children under 12 must be supervised by an adult",
                    "No glass containers in pool area",
                    "Shower before entering the pool",
                    "No food or drinks in the pool",
                    "Pool hours: 6:00 AM - 10:00 PM",
                    "Maximum occupancy: 50 people",
                    "No pets allowed in pool area",
                    "Lifeguard on duty during posted hours",
                    "Emergency phone located at pool entrance"
                ],
                currentNotices: [],
                lastUpdated: Utils.formatDateTime()
            },
            'incidents.json': {
                incidents: [],
                lastUpdated: Utils.formatDateTime()
            }
        };

        for (const [filename, data] of Object.entries(defaultData)) {
            this.cache[filename] = data;
            localStorage.setItem(`poolpass_${filename}`, JSON.stringify(data));
        }

        console.log('Default data created');
    },

    // Backup data
    async backupData() {
        try {
            const backupData = {
                timestamp: Utils.formatDateTime(),
                data: this.cache
            };

            const backupString = JSON.stringify(backupData, null, 2);
            const filename = `backup_${Utils.getCurrentDateString()}_${Date.now()}.json`;
            
            Utils.downloadFile(backupString, filename, 'application/json');
            Utils.showToast('Backup created successfully', 'success');
            
            return filename;
        } catch (error) {
            console.error('Failed to create backup:', error);
            Utils.showToast('Failed to create backup', 'error');
            throw error;
        }
    },

    // Restore data from backup
    async restoreData(backupFile) {
        try {
            const text = await backupFile.text();
            const backupData = JSON.parse(text);
            
            // Validate backup data
            if (!backupData.data || !backupData.timestamp) {
                throw new Error('Invalid backup file format');
            }

            // Restore data
            this.cache = backupData.data;
            
            // Save restored data
            for (const [filename, data] of Object.entries(backupData.data)) {
                localStorage.setItem(`poolpass_${filename}`, JSON.stringify(data));
            }

            Utils.showToast('Data restored successfully', 'success');
            return true;
        } catch (error) {
            console.error('Failed to restore backup:', error);
            Utils.showToast('Failed to restore backup', 'error');
            throw error;
        }
    },

    // Get settings
    getSettings() {
        return this.getData('settings.json');
    },

    // Update settings
    async updateSettings(updates) {
        return await this.updateData('settings.json', updates);
    },

    // Get residents
    getResidents() {
        const data = this.getData('residents.json');
        return data ? data.residents : [];
    },

    // Add resident
    async addResident(name, id = null) {
        const residents = this.getResidents();
        
        // Generate ID if not provided
        if (!id) {
            const existingIds = residents.map(r => r.id);
            let newId = 1;
            while (existingIds.includes(`PP${newId.toString().padStart(3, '0')}`)) {
                newId++;
            }
            id = `PP${newId.toString().padStart(3, '0')}`;
        }
        
        // Check if resident already exists
        if (residents.find(r => r.id === id || r.name === name)) {
            throw new Error('Resident already exists');
        }
        
        residents.push({ id, name });
        await this.updateData('residents.json', { residents });
        return residents;
    },

    // Get occupancy data
    getOccupancy() {
        return this.getData('occupancy.json');
    },

    // Update occupancy
    async updateOccupancy(updates) {
        return await this.updateData('occupancy.json', updates);
    },

    // Get notices
    getNotices() {
        return this.getData('notices.json');
    },

    // Update notices
    async updateNotices(updates) {
        return await this.updateData('notices.json', updates);
    },

    // Get incidents
    getIncidents() {
        return this.getData('incidents.json');
    },

    // Add incident
    async addIncident(incident) {
        const data = this.getIncidents();
        const incidents = data ? data.incidents : [];
        
        const newIncident = {
            id: Utils.generateId(),
            timestamp: Utils.formatDateTime(),
            ...incident
        };
        
        incidents.unshift(newIncident); // Add to beginning
        
        await this.updateData('incidents.json', { incidents });
        return newIncident;
    },

    // Clear all data (for testing)
    async clearAllData() {
        try {
            this.cache = {};
            localStorage.clear();
            await this.createDefaultData();
            Utils.showToast('All data cleared', 'info');
        } catch (error) {
            console.error('Failed to clear data:', error);
            throw error;
        }
    },

    // Export data as JSON
    exportData() {
        try {
            const exportData = {
                exportDate: Utils.formatDateTime(),
                data: this.cache
            };
            
            const filename = `poolpass_export_${Utils.getCurrentDateString()}.json`;
            Utils.downloadFile(JSON.stringify(exportData, null, 2), filename, 'application/json');
            Utils.showToast('Data exported successfully', 'success');
        } catch (error) {
            console.error('Failed to export data:', error);
            Utils.showToast('Failed to export data', 'error');
        }
    },

    // Import data from JSON
    async importData(file) {
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            
            if (!importData.data) {
                throw new Error('Invalid import file format');
            }
            
            this.cache = importData.data;
            
            // Save imported data
            for (const [filename, data] of Object.entries(importData.data)) {
                localStorage.setItem(`poolpass_${filename}`, JSON.stringify(data));
            }
            
            Utils.showToast('Data imported successfully', 'success');
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            Utils.showToast('Failed to import data', 'error');
            throw error;
        }
    },

    // Auto backup functionality
    startAutoBackup() {
        const settings = this.getSettings();
        if (settings && settings.autoBackup) {
            setInterval(() => {
                this.backupData();
            }, settings.backupInterval);
        }
    },

    // Get data statistics
    getStats() {
        const occupancy = this.getOccupancy();
        const incidents = this.getIncidents();
        const residents = this.getResidents();
        
        return {
            totalResidents: residents.length,
            currentOccupancy: occupancy ? occupancy.currentCount : 0,
            currentlyCheckedIn: occupancy ? occupancy.currentlyCheckedIn.length : 0,
            totalIncidents: incidents ? incidents.incidents.length : 0,
            todayCheckins: occupancy && occupancy.today ? occupancy.today.totalCheckins : 0
        };
    }
};

// Initialize storage when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Storage.init();
}); 