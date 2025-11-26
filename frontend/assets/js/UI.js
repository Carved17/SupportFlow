// frontend/assets/js/UI.js
class UI {
    // Error handling methods
    static showError(elementId, message) {
        console.log('Showing error:', elementId, message);
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            element.style.color = '#dc3545';
            element.style.fontSize = '0.875rem';
            element.style.marginTop = '0.25rem';
        }
        console.error('UI Error:', message);
    }

    static hideError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    }

    static showSuccess(message) {
        console.log('Showing success:', message);
        // Create a simple alert for now
        alert('Success: ' + message);
    }

    // Loading states
    static showLoading(button, text = 'Loading...') {
        if (!button) return;
        
        button.setAttribute('data-original-text', button.textContent);
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
        button.disabled = true;
    }

    static hideLoading(button) {
        if (!button) return;
        
        const originalText = button.getAttribute('data-original-text') || 'Submit';
        button.textContent = originalText;
        button.disabled = false;
    }

    // Utility methods
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    static formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    }

    static isValidEmail(email) {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Flash message functionality (NEW)
    static flashMessage(message, type = 'success') {
        console.log(`${type.toUpperCase()}: ${message}`);
        // Use the existing notify method as fallback
        this.notify(message, type);
    }

    // Modal functionality (UPDATED)
    static createModal(title, content, buttons = []) {
        // Remove existing modal
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttons.map(btn => `
                        <button class="btn ${btn.class}" onclick="${btn.onclick}">
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });

        return modalOverlay;
    }

    static confirm(message, onConfirm, onCancel = null) {
        this.createModal(
            'Confirmation',
            `<p>${message}</p>`,
            [
                {
                    text: 'Cancel',
                    class: 'btn-outline',
                    onclick: `document.body.removeChild(this.closest('.modal-overlay')); ${onCancel || ''}`
                },
                {
                    text: 'Confirm',
                    class: 'btn-primary',
                    onclick: `document.body.removeChild(this.closest('.modal-overlay')); ${onConfirm}`
                }
            ]
        );
    }

    // Form validation
    static validateForm(formData, rules) {
        const errors = {};
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData.get(field);
            
            if (rule.required && !value) {
                errors[field] = `${this.capitalizeFirst(field)} is required`;
            }
            
            if (rule.email && value && !this.isValidEmail(value)) {
                errors[field] = 'Please enter a valid email address';
            }
            
            if (rule.minLength && value && value.length < rule.minLength) {
                errors[field] = `${this.capitalizeFirst(field)} must be at least ${rule.minLength} characters`;
            }
        }
        
        return errors;
    }

    static capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Simple notification system (fallback)
    static notify(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Create simple notification div
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
        `;
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal {
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #2c3e50;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #6c757d;
        padding: 0.25rem;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }
    
    .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s;
    }
    
    .btn-primary {
        background: #007bff;
        color: white;
    }
    
    .btn-primary:hover {
        background: #0056b3;
    }
    
    .btn-outline {
        background: transparent;
        color: #6c757d;
        border: 1px solid #6c757d;
    }
    
    .btn-outline:hover {
        background: #6c757d;
        color: white;
    }
    
    .fa-spin {
        animation: fa-spin 1s infinite linear;
    }
    
    @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Global error styling */
    #globalError {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #dc3545;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: none;
    }
`;
document.head.appendChild(style);

// Make UI available globally
window.UI = UI;