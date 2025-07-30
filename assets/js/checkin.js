// Check-in functionality for PoolPass

const Checkin = {
    // Resident suggestions cache
    suggestions: [],
    
    // Initialize check-in functionality
    init() {
        this.setupEventListeners();
        this.loadResidentSuggestions();
    },

    // Setup event listeners
    setupEventListeners() {
        const poolPassInput = document.getElementById('poolPassId');
        const guestInput = document.getElementById('guestCount');
        
        if (poolPassInput) {
            // Debounced search for suggestions
            const debouncedSearch = Utils.debounce((query) => {
                this.searchResidents(query);
            }, 300);

            poolPassInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 0) {
                    debouncedSearch(query);
                } else {
                    this.hideSuggestions();
                }
            });

            // Handle suggestion selection
            poolPassInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateSuggestions(e.key === 'ArrowDown' ? 1 : -1);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.selectCurrentSuggestion();
                } else if (e.key === 'Escape') {
                    this.hideSuggestions();
                }
            });

            // Handle focus/blur
            poolPassInput.addEventListener('focus', () => {
                if (poolPassInput.value.trim().length > 0) {
                    this.searchResidents(poolPassInput.value.trim());
                }
            });

            // Hide suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.form-group')) {
                    this.hideSuggestions();
                }
            });
        }

        if (guestInput) {
            // Validate guest count
            guestInput.addEventListener('input', (e) => {
                this.validateGuestCount(e.target);
            });
        }
    },

    // Load resident suggestions from storage
    loadResidentSuggestions() {
        const residentsData = Storage.getResidents();
        this.suggestions = residentsData.map(resident => ({
            id: resident.id,
            name: resident.name,
            displayText: `${resident.id} - ${resident.name}`
        }));
    },

    // Search residents based on query
    searchResidents(query) {
        if (!query || query.length < 1) {
            this.hideSuggestions();
            return;
        }

        const filtered = this.suggestions.filter(resident =>
            resident.id.toLowerCase().includes(query.toLowerCase()) ||
            resident.name.toLowerCase().includes(query.toLowerCase())
        );

        this.showSuggestions(filtered, query);
    },

    // Show resident suggestions
    showSuggestions(suggestions, query) {
        const container = document.getElementById('residentSuggestions');
        if (!container) return;

        if (suggestions.length === 0) {
            container.innerHTML = '<div class="resident-suggestion">No residents found</div>';
        } else {
            container.innerHTML = suggestions.map(resident => 
                `<div class="resident-suggestion" data-id="${resident.id}" data-name="${resident.name}">${resident.displayText}</div>`
            ).join('');

            // Add click handlers
            container.querySelectorAll('.resident-suggestion').forEach(suggestion => {
                suggestion.addEventListener('click', () => {
                    this.selectResident(suggestion.dataset.id, suggestion.dataset.name);
                });
            });
        }

        container.style.display = 'block';
    },

    // Hide suggestions
    hideSuggestions() {
        const container = document.getElementById('residentSuggestions');
        if (container) {
            container.style.display = 'none';
        }
    },

    // Navigate suggestions with arrow keys
    navigateSuggestions(direction) {
        const container = document.getElementById('residentSuggestions');
        if (!container) return;

        const suggestions = container.querySelectorAll('.resident-suggestion');
        const currentIndex = Array.from(suggestions).findIndex(s => s.classList.contains('selected'));
        
        // Remove current selection
        suggestions.forEach(s => s.classList.remove('selected'));
        
        let newIndex;
        if (currentIndex === -1) {
            newIndex = direction > 0 ? 0 : suggestions.length - 1;
        } else {
            newIndex = currentIndex + direction;
            if (newIndex < 0) newIndex = suggestions.length - 1;
            if (newIndex >= suggestions.length) newIndex = 0;
        }
        
        if (suggestions[newIndex]) {
            suggestions[newIndex].classList.add('selected');
        }
    },

    // Select current suggestion
    selectCurrentSuggestion() {
        const container = document.getElementById('residentSuggestions');
        if (!container) return;

        const selected = container.querySelector('.resident-suggestion.selected');
        if (selected && selected.dataset.name) {
            this.selectResident(selected.dataset.name);
        }
    },

    // Select a resident
    selectResident(id, name) {
        const input = document.getElementById('poolPassId');
        if (input) {
            input.value = id;
            this.hideSuggestions();
            input.focus();
        }
    },

    // Validate guest count
    validateGuestCount(input) {
        const value = parseInt(input.value) || 0;
        const settings = Storage.getSettings();
        const maxGuests = settings ? settings.maxGuestsPerResident : 5;

        if (value < 0) {
            input.value = 0;
        } else if (value > maxGuests) {
            input.value = maxGuests;
            Utils.showToast(`Maximum ${maxGuests} guests allowed per resident`, 'info');
        }
    },

    // Setup check-in form
    setupCheckinForm() {
        // Clear form
        this.clearForm();
        
        // Focus on pool pass input
        const poolPassInput = document.getElementById('poolPassId');
        if (poolPassInput) {
            poolPassInput.focus();
        }
    },

    // Clear check-in form
    clearForm() {
        const poolPassInput = document.getElementById('poolPassId');
        const guestInput = document.getElementById('guestCount');
        
        if (poolPassInput) poolPassInput.value = '';
        if (guestInput) guestInput.value = '0';
        
        this.hideSuggestions();
    },

    // Submit check-in
    async submitCheckin() {
        try {
            // Validate form
            const validation = this.validateForm();
            if (!validation.isValid) {
                Utils.showToast(validation.message, 'error');
                return;
            }

            // Get form data
            const formData = this.getFormData();
            
            // Check if pool is open
            if (!App.isPoolOpen()) {
                Utils.showToast('Pool is currently closed', 'error');
                return;
            }

            // Check occupancy limits
            const occupancyCheck = this.checkOccupancyLimits(formData);
            if (!occupancyCheck.canCheckin) {
                Utils.showToast(occupancyCheck.message, 'error');
                return;
            }

            // Process check-in
            await this.processCheckin(formData);
            
            // Show success message
            Utils.showToast('Check-in successful!', 'success');
            
            // Clear form and return to home
            this.clearForm();
            setTimeout(() => {
                App.showScreen('homeScreen');
            }, 1500);

        } catch (error) {
            console.error('Check-in failed:', error);
            Utils.showToast('Check-in failed. Please try again.', 'error');
        }
    },

    // Validate check-in form
    validateForm() {
        const poolPassInput = document.getElementById('poolPassId');
        const guestInput = document.getElementById('guestCount');
        
        if (!poolPassInput || !guestInput) {
            return { isValid: false, message: 'Form elements not found' };
        }

        const poolPassId = poolPassInput.value.trim();
        const guests = parseInt(guestInput.value) || 0;

        if (!poolPassId) {
            return { isValid: false, message: 'Please enter your Pool Pass ID' };
        }

        // Check if pool pass ID exists
        const residents = Storage.getResidents();
        const resident = residents.find(r => r.id === poolPassId);
        
        if (!resident) {
            return { isValid: false, message: 'Invalid Pool Pass ID' };
        }

        // Check if already checked in
        const occupancy = Storage.getOccupancy();
        const alreadyCheckedIn = occupancy.currentlyCheckedIn.find(r => r.id === poolPassId);
        
        if (alreadyCheckedIn) {
            return { isValid: false, message: 'You are already checked in' };
        }

        if (guests < 0) {
            return { isValid: false, message: 'Guest count cannot be negative' };
        }

        const settings = Storage.getSettings();
        const maxGuests = settings ? settings.maxGuestsPerResident : 5;
        
        if (guests > maxGuests) {
            return { isValid: false, message: `Maximum ${maxGuests} guests allowed` };
        }

        return { isValid: true, resident: resident };
    },

    // Get form data
    getFormData() {
        const poolPassInput = document.getElementById('poolPassId');
        const guestInput = document.getElementById('guestCount');
        
        const poolPassId = poolPassInput ? poolPassInput.value.trim() : '';
        const residents = Storage.getResidents();
        const resident = residents.find(r => r.id === poolPassId);
        
        return {
            id: poolPassId,
            name: resident ? resident.name : '',
            guests: guestInput ? parseInt(guestInput.value) || 0 : 0,
            timestamp: Utils.formatDateTime(),
            date: Utils.getCurrentDateString()
        };
    },

    // Check occupancy limits
    checkOccupancyLimits(formData) {
        const occupancy = Storage.getOccupancy();
        if (!occupancy) {
            return { canCheckin: false, message: 'Unable to check occupancy' };
        }

        const totalNewPeople = 1 + formData.guests; // Resident + guests
        const newTotal = occupancy.currentCount + totalNewPeople;
        const maxOccupancy = occupancy.maxCount;

        if (newTotal > maxOccupancy) {
            return { 
                canCheckin: false, 
                message: `Pool is at capacity. Only ${maxOccupancy - occupancy.currentCount} more people allowed.` 
            };
        }

        return { canCheckin: true };
    },

    // Process check-in
    async processCheckin(formData) {
        const occupancy = Storage.getOccupancy();
        if (!occupancy) {
            throw new Error('Unable to load occupancy data');
        }

        // Update occupancy count
        const totalNewPeople = 1 + formData.guests;
        const newCount = occupancy.currentCount + totalNewPeople;
        
        // Add to currently checked in list
        const currentlyCheckedIn = [...occupancy.currentlyCheckedIn];
        currentlyCheckedIn.push({
            id: formData.id,
            name: formData.name,
            guests: formData.guests,
            checkinTime: formData.timestamp
        });
        
        // Update today's data
        const today = occupancy.today;
        if (!Utils.isToday(today.date)) {
            // Reset for new day
            today.date = Utils.getCurrentDateString();
            today.totalCheckins = 0;
            today.peakOccupancy = 0;
            today.checkins = [];
        }

        // Add check-in record
        today.checkins.push({
            id: Utils.generateId(),
            ...formData
        });

        today.totalCheckins += totalNewPeople;
        today.peakOccupancy = Math.max(today.peakOccupancy, newCount);

        // Update occupancy data
        await Storage.updateOccupancy({
            currentCount: newCount,
            currentlyCheckedIn: currentlyCheckedIn,
            today: today
        });

        // Update UI
        App.updateOccupancyDisplay();
    },

    // Get check-in statistics
    getCheckinStats() {
        const occupancy = Storage.getOccupancy();
        if (!occupancy || !occupancy.today) {
            return {
                todayCheckins: 0,
                peakOccupancy: 0,
                currentOccupancy: 0
            };
        }

        return {
            todayCheckins: occupancy.today.totalCheckins,
            peakOccupancy: occupancy.today.peakOccupancy,
            currentOccupancy: occupancy.currentCount
        };
    },

    // Export check-in data
    exportCheckinData() {
        const occupancy = Storage.getOccupancy();
        if (!occupancy) {
            Utils.showToast('No check-in data available', 'error');
            return;
        }

        const exportData = {
            exportDate: Utils.formatDateTime(),
            currentOccupancy: occupancy.currentCount,
            maxOccupancy: occupancy.maxCount,
            today: occupancy.today,
            history: occupancy.history
        };

        const filename = `checkin_data_${Utils.getCurrentDateString()}.json`;
        Utils.downloadFile(JSON.stringify(exportData, null, 2), filename, 'application/json');
        Utils.showToast('Check-in data exported', 'success');
    },

    // Reset occupancy count (admin function)
    async resetOccupancy() {
        try {
            Utils.showConfirm(
                'Are you sure you want to reset the occupancy count to 0?',
                async () => {
                    await Storage.updateOccupancy({
                        currentCount: 0
                    });
                    App.updateOccupancyDisplay();
                    Utils.showToast('Occupancy reset to 0', 'success');
                }
            );
        } catch (error) {
            console.error('Failed to reset occupancy:', error);
            Utils.showToast('Failed to reset occupancy', 'error');
        }
    },

    // Manually adjust occupancy (admin function)
    async adjustOccupancy(newCount) {
        try {
            const occupancy = Storage.getOccupancy();
            if (!occupancy) {
                throw new Error('Unable to load occupancy data');
            }

            if (newCount < 0) {
                newCount = 0;
            }

            if (newCount > occupancy.maxCount) {
                Utils.showToast(`Maximum occupancy is ${occupancy.maxCount}`, 'warning');
                newCount = occupancy.maxCount;
            }

            await Storage.updateOccupancy({
                currentCount: newCount
            });

            App.updateOccupancyDisplay();
            Utils.showToast(`Occupancy adjusted to ${newCount}`, 'success');

        } catch (error) {
            console.error('Failed to adjust occupancy:', error);
            Utils.showToast('Failed to adjust occupancy', 'error');
        }
    },

    // Logout resident (self-service)
    async logoutResident() {
        try {
            const logoutInput = document.getElementById('logoutPoolPassId');
            if (!logoutInput) {
                Utils.showToast('Logout form not found', 'error');
                return;
            }

            const poolPassId = logoutInput.value.trim();
            if (!poolPassId) {
                Utils.showToast('Please enter your Pool Pass ID', 'error');
                return;
            }

            const occupancy = Storage.getOccupancy();
            if (!occupancy) {
                throw new Error('Unable to load occupancy data');
            }

            // Find the resident to check out
            const resident = occupancy.currentlyCheckedIn.find(r => r.id === poolPassId);
            if (!resident) {
                Utils.showToast('You are not currently checked in', 'error');
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

            // Clear logout form
            logoutInput.value = '';

            // Update UI
            App.updateOccupancyDisplay();

            Utils.showToast(`Thank you for visiting! ${resident.name} checked out successfully`, 'success');
        } catch (error) {
            console.error('Failed to check out resident:', error);
            Utils.showToast('Failed to check out. Please try again.', 'error');
        }
    }
};

// Initialize check-in when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Checkin.init();
});

// Global function for HTML onclick handler
function submitCheckin() {
    Checkin.submitCheckin();
} 