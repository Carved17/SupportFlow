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
        // Create success notification
        this.notify(message, 'success');
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

    // Modal functionality
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

    // Edit Ticket Modal Functions
    static createEditTicketModal(ticket, onSave) {
        // Remove existing modal first
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div class="modal-overlay" id="editTicketModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Edit Ticket #${ticket._id || ticket.id}</h3>
                        <button class="modal-close" onclick="UI.closeModal('editTicketModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="editTicketForm">
                            <div class="form-group">
                                <label class="form-label">Title *</label>
                                <input type="text" class="form-control" id="editTitle" value="${ticket.title}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Description *</label>
                                <textarea class="form-control" id="editDescription" rows="4" required>${ticket.description}</textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Status</label>
                                    <select class="form-control" id="editStatus">
                                        <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                                        <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                        <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Priority</label>
                                    <select class="form-control" id="editPriority">
                                        <option value="Low" ${ticket.priority === 'Low' ? 'selected' : ''}>Low</option>
                                        <option value="Medium" ${ticket.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                        <option value="High" ${ticket.priority === 'High' ? 'selected' : ''}>High</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Category</label>
                                    <select class="form-control" id="editCategory">
                                        <option value="Technical" ${ticket.category === 'Technical' ? 'selected' : ''}>Technical</option>
                                        <option value="Billing" ${ticket.category === 'Billing' ? 'selected' : ''}>Billing</option>
                                        <option value="Feature" ${ticket.category === 'Feature' ? 'selected' : ''}>Feature</option>
                                        <option value="Bug" ${ticket.category === 'Bug' ? 'selected' : ''}>Bug</option>
                                        <option value="General" ${!ticket.category || ticket.category === 'General' ? 'selected' : ''}>General</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Assigned To</label>
                                    <input type="text" class="form-control" id="editAssignedTo" value="${ticket.assignedTo || ''}" placeholder="Unassigned">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Customer Email *</label>
                                <input type="email" class="form-control" id="editCustomerEmail" value="${ticket.customerEmail}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Customer Name</label>
                                <input type="text" class="form-control" id="editCustomerName" value="${ticket.customerName || ''}" placeholder="Customer name">
                            </div>
                        </form>
                        <div id="editError" class="form-error" style="display: none;"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline" onclick="UI.closeModal('editTicketModal')">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="UI.saveTicketEdit('${ticket._id || ticket.id}')">Save Changes</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Store the callback function
        if (onSave) {
            window.editTicketCallback = onSave;
        }
    }

    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
        // Clean up callback
        window.editTicketCallback = null;
    }

    static async saveTicketEdit(ticketId) {
        try {
            console.log('Saving ticket edit:', ticketId);
            
            // Get form data
            const formData = {
                title: document.getElementById('editTitle').value,
                description: document.getElementById('editDescription').value,
                status: document.getElementById('editStatus').value,
                priority: document.getElementById('editPriority').value,
                category: document.getElementById('editCategory').value,
                assignedTo: document.getElementById('editAssignedTo').value,
                customerEmail: document.getElementById('editCustomerEmail').value,
                customerName: document.getElementById('editCustomerName').value
            };

            // Validate required fields
            if (!formData.title || !formData.description || !formData.customerEmail) {
                this.showError('editError', 'Please fill in all required fields');
                return;
            }

            if (!this.isValidEmail(formData.customerEmail)) {
                this.showError('editError', 'Please enter a valid email address');
                return;
            }

            // Hide any previous errors
            this.hideError('editError');

            // Show loading state
            const saveButton = document.querySelector('#editTicketModal .btn-primary');
            this.showLoading(saveButton, 'Saving...');

            // Call the API
            await ticketAPI.updateTicket(ticketId, formData);
            
            // Close modal and show success
            this.closeModal('editTicketModal');
            this.showSuccess('Ticket updated successfully!');

            // Call the callback function to refresh the UI
            if (typeof window.editTicketCallback === 'function') {
                window.editTicketCallback();
            }
            
        } catch (error) {
            console.error('Error saving ticket edit:', error);
            this.showError('editError', error.message);
            
            // Reset loading state
            const saveButton = document.querySelector('#editTicketModal .btn-primary');
            this.hideLoading(saveButton);
        }
    }

    // Quick Status Update Modal
    static createQuickStatusModal(ticketId, currentStatus, onUpdate) {
        const modalHTML = `
            <div class="modal-overlay" id="quickStatusModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Update Ticket Status</h3>
                        <button class="modal-close" onclick="UI.closeModal('quickStatusModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-control" id="quickStatus">
                                <option value="Open" ${currentStatus === 'Open' ? 'selected' : ''}>Open</option>
                                <option value="In Progress" ${currentStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Resolved" ${currentStatus === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                <option value="Closed" ${currentStatus === 'Closed' ? 'selected' : ''}>Closed</option>
                            </select>
                        </div>
                        <div id="quickStatusError" class="form-error" style="display: none;"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline" onclick="UI.closeModal('quickStatusModal')">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="UI.saveQuickStatus('${ticketId}')">Update Status</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Store the callback function
        if (onUpdate) {
            window.quickStatusCallback = onUpdate;
        }
    }

    static async saveQuickStatus(ticketId) {
        try {
            const newStatus = document.getElementById('quickStatus').value;
            
            // Show loading state
            const updateButton = document.querySelector('#quickStatusModal .btn-primary');
            this.showLoading(updateButton, 'Updating...');

            // Call the API
            await ticketAPI.updateTicket(ticketId, { status: newStatus });
            
            // Close modal and show success
            this.closeModal('quickStatusModal');
            this.showSuccess(`Ticket status updated to ${newStatus}!`);

            // Call the callback function to refresh the UI
            if (typeof window.quickStatusCallback === 'function') {
                window.quickStatusCallback();
            }
            
        } catch (error) {
            console.error('Error updating status:', error);
            this.showError('quickStatusError', error.message);
            
            // Reset loading state
            const updateButton = document.querySelector('#quickStatusModal .btn-primary');
            this.hideLoading(updateButton);
        }
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

    // Notification system
    static notify(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Create notification div
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

// Add CSS for animations and modal styling
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
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
    }
    
    .modal {
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
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
    
    .modal-close:hover {
        color: #2c3e50;
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
    
    .btn-danger {
        background: #dc3545;
        color: white;
    }
    
    .btn-danger:hover {
        background: #c82333;
    }
    
    .fa-spin {
        animation: fa-spin 1s infinite linear;
    }
    
    @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Form improvements */
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #2c3e50;
    }
    
    .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .form-control:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
    
    .form-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: none;
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
    
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .modal {
            margin: 1rem;
        }
    }
`;
document.head.appendChild(style);

// Make UI available globally
window.UI = UI;