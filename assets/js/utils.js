// Utility functions for PoolPass app

// Date and time utilities
const Utils = {
    // Format current date and time
    formatDateTime(date = new Date()) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },

    // Format date only
    formatDate(date = new Date()) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    // Get current date string (YYYY-MM-DD)
    getCurrentDateString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },

    // Check if date is today
    isToday(dateString) {
        return dateString === this.getCurrentDateString();
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate PIN format (4 digits)
    isValidPin(pin) {
        return /^\d{4}$/.test(pin);
    },

    // Sanitize input text
    sanitizeText(text) {
        return text.replace(/[<>]/g, '').trim();
    },

    // Capitalize first letter of each word
    capitalizeWords(text) {
        return text.replace(/\b\w/g, l => l.toUpperCase());
    },

    // Show toast notification
    showToast(message, type = 'info', duration = 3000) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, duration);

        return toast;
    },

    // Show confirmation dialog
    showConfirm(message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="confirm-dialog">
                <h3>Confirm Action</h3>
                <p>${message}</p>
                <div class="confirm-actions">
                    <button class="confirm-btn cancel">Cancel</button>
                    <button class="confirm-btn danger">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const confirmBtn = modal.querySelector('.confirm-btn.danger');
        const cancelBtn = modal.querySelector('.confirm-btn.cancel');

        confirmBtn.addEventListener('click', () => {
            modal.remove();
            if (onConfirm) onConfirm();
        });

        cancelBtn.addEventListener('click', () => {
            modal.remove();
            if (onCancel) onCancel();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                if (onCancel) onCancel();
            }
        });
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Get time difference in minutes
    getTimeDifference(date1, date2 = new Date()) {
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60));
    },

    // Check if time is within pool hours
    isWithinPoolHours() {
        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const openTime = 600; // 6:00 AM
        const closeTime = 2200; // 10:00 PM
        
        return currentTime >= openTime && currentTime <= closeTime;
    },

    // Generate random string
    randomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // Validate phone number
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },

    // Format phone number
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    },

    // Check if device is mobile/touch
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    // Add loading state to element
    addLoading(element) {
        element.classList.add('loading');
        element.disabled = true;
    },

    // Remove loading state from element
    removeLoading(element) {
        element.classList.remove('loading');
        element.disabled = false;
    },

    // Scroll to element smoothly
    scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!', 'success');
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    },

    // Download file
    downloadFile(content, filename, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} 