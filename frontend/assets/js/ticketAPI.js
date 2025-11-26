// frontend/assets/js/ticketAPI.js
const API_BASE_URL = 'http://localhost:5000/api';

class TicketAPI {
    // REAL USER AUTHENTICATION WITH BACKEND
    static async login(email, password) {
        try {
            console.log('🔐 Login attempt:', email);
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Invalid email or password');
            }

            console.log('✅ Login successful:', result.data);
            
            // Store user data in localStorage
            localStorage.setItem('supportFlowUser', JSON.stringify(result.data));
            
            return result.data;
            
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    }

    static async register(name, email, password) {
        try {
            console.log('📝 Registration attempt:', name, email);
            
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Registration failed');
            }

            console.log('✅ Registration successful:', result.data);
            
            // Store user data in localStorage
            localStorage.setItem('supportFlowUser', JSON.stringify(result.data));
            
            return result.data;
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            throw error;
        }
    }

    // TICKET OPERATIONS

    // Create a new ticket
    static async createTicket(ticketData) {
        try {
            console.log('📝 Creating ticket via API:', ticketData);
            
            // Get current user from localStorage
            const userData = localStorage.getItem('supportFlowUser');
            if (!userData) {
                throw new Error('User not authenticated. Please login again.');
            }
            
            const user = JSON.parse(userData);
            console.log('Current user context:', user);
            
            // Add user context
            const dataWithContext = {
                ...ticketData,
                userId: user.id
            };
            
            const response = await fetch(`${API_BASE_URL}/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataWithContext)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Failed to create ticket: ${response.status}`);
            }

            console.log('✅ Ticket created successfully via API:', result.data);
            return result.data;
            
        } catch (error) {
            console.error('❌ Error creating ticket via API:', error);
            throw error;
        }
    }

    // Get all tickets with role-based filtering
    static async getTickets(userRole = '', userEmail = '', userId = '') {
        try {
            console.log('📋 Fetching tickets via API...');
            
            // Get current user from localStorage if not provided
            const userData = localStorage.getItem('supportFlowUser');
            if (userData && (!userRole || !userEmail || !userId)) {
                const user = JSON.parse(userData);
                userRole = userRole || user.role;
                userEmail = userEmail || user.email;
                userId = userId || user.id;
            }
            
            // Add user role and email to query params for filtering
            const params = new URLSearchParams();
            if (userRole) params.append('userRole', userRole);
            if (userEmail) params.append('userEmail', userEmail);
            if (userId) params.append('userId', userId);
            
            const queryString = params.toString();
            const url = queryString ? `${API_BASE_URL}/tickets?${queryString}` : `${API_BASE_URL}/tickets`;
            
            console.log('Fetching tickets from:', url);
            
            const response = await fetch(url);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Failed to fetch tickets: ${response.status}`);
            }

            console.log(`✅ Tickets fetched successfully via API: ${result.count} tickets`);
            return result.data;
            
        } catch (error) {
            console.error('❌ Error fetching tickets via API:', error);
            throw error;
        }
    }

    // Get single ticket
    static async getTicket(id) {
        try {
            console.log('🔍 Fetching ticket via API:', id);
            
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Failed to fetch ticket: ${response.status}`);
            }

            console.log('✅ Ticket fetched successfully via API:', result.data);
            return result.data;
            
        } catch (error) {
            console.error('❌ Error fetching ticket via API:', error);
            throw error;
        }
    }

    // Update ticket with user context
    static async updateTicket(id, ticketData) {
        try {
            // Validate ticket ID
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid ticket ID: ID is required');
            }

            console.log('✏️ Updating ticket via API:', id, ticketData);
            
            // Get current user from localStorage
            const userData = localStorage.getItem('supportFlowUser');
            if (!userData) {
                throw new Error('User not authenticated. Please login again.');
            }
            
            const user = JSON.parse(userData);
            console.log('Current user context:', { role: user.role, email: user.email, id: user.id });
            
            // Add user context for role-based authorization
            const dataWithContext = {
                ...ticketData,
                userRole: user.role,
                userEmail: user.email,
                userId: user.id
            };
            
            console.log('Sending data with context:', dataWithContext);
            
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataWithContext)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Failed to update ticket: ${response.status}`);
            }

            console.log('✅ Ticket updated successfully via API:', result.data);
            return result.data;
            
        } catch (error) {
            console.error('❌ Error updating ticket via API:', error);
            throw error;
        }
    }

    // Assign ticket to agent with user context
    static async assignTicket(id, agentData) {
        try {
            console.log('👤 Assigning ticket via API:', id, agentData);
            
            // Get current user from localStorage
            const userData = localStorage.getItem('supportFlowUser');
            if (!userData) {
                throw new Error('User not authenticated. Please login again.');
            }
            
            const user = JSON.parse(userData);
            console.log('Current user context:', { role: user.role, email: user.email, id: user.id });
            
            // Add user context for role-based authorization
            const dataWithContext = {
                ...agentData,
                userRole: user.role,
                userId: user.id
            };
            
            console.log('Sending data with context:', dataWithContext);
            
            const response = await fetch(`${API_BASE_URL}/tickets/${id}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataWithContext)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Failed to assign ticket: ${response.status}`);
            }

            console.log('✅ Ticket assigned successfully via API:', result.data);
            return result.data;
            
        } catch (error) {
            console.error('❌ Error assigning ticket via API:', error);
            throw error;
        }
    }

    // Delete ticket with user context
    static async deleteTicket(id) {
        try {
            console.log('🗑️ Deleting ticket via API:', id);
            
            // Get current user from localStorage
            const userData = localStorage.getItem('supportFlowUser');
            if (!userData) {
                throw new Error('User not authenticated. Please login again.');
            }
            
            const user = JSON.parse(userData);
            console.log('Current user context:', { role: user.role, email: user.email, id: user.id });
            
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userRole: user.role,
                    userEmail: user.email,
                    userId: user.id
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Failed to delete ticket: ${response.status}`);
            }

            console.log('✅ Ticket deleted successfully via API:', result.data);
            return result.data;
            
        } catch (error) {
            console.error('❌ Error deleting ticket via API:', error);
            throw error;
        }
    }

    // Health check
    static async healthCheck() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error('❌ Health check failed:', error);
            throw error;
        }
    }

    // Initialize sample data (if you still want this)
    static async initSampleData() {
        try {
            const response = await fetch(`${API_BASE_URL}/init-data`, {
                method: 'POST'
            });
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Failed to initialize sample data');
            }
            
            console.log('✅ Sample data initialized:', result);
            return result;
        } catch (error) {
            console.error('❌ Error initializing sample data:', error);
            throw error;
        }
    }

    // Get ticket by ID (alias for getTicket - for compatibility)
    static async getTicketById(id) {
        return await this.getTicket(id);
    }

    // Debug method to check current user data
    static debugUserData() {
        console.log('=== TICKETAPI USER DATA DEBUG ===');
        const userData = localStorage.getItem('supportFlowUser');
        console.log('LocalStorage User Data:', userData);
        
        if (userData) {
            const user = JSON.parse(userData);
            console.log('Parsed User:', user);
            console.log('User Role:', user.role);
            console.log('User Email:', user.email);
            console.log('User ID:', user.id);
        } else {
            console.log('No user data found in localStorage');
        }
        console.log('=================================');
    }
}

// Global instance
const ticketAPI = {
    login: (email, password) => TicketAPI.login(email, password),
    register: (name, email, password) => TicketAPI.register(name, email, password),
    createTicket: (ticketData) => TicketAPI.createTicket(ticketData),
    getTickets: (userRole, userEmail, userId) => TicketAPI.getTickets(userRole, userEmail, userId),
    getTicket: (id) => TicketAPI.getTicket(id),
    getTicketById: (id) => TicketAPI.getTicketById(id),
    updateTicket: (id, ticketData) => TicketAPI.updateTicket(id, ticketData),
    assignTicket: (id, agentData) => TicketAPI.assignTicket(id, agentData),
    deleteTicket: (id) => TicketAPI.deleteTicket(id),
    healthCheck: () => TicketAPI.healthCheck(),
    initSampleData: () => TicketAPI.initSampleData(),
    debugUserData: () => TicketAPI.debugUserData()
};

// Make available globally
window.TicketAPI = TicketAPI;
window.ticketAPI = ticketAPI;

console.log('✅ ticketAPI.js loaded successfully');