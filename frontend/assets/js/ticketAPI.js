// frontend/js/ticketAPI.js
const API_BASE_URL = 'http://localhost:5000/api';

class TicketAPI {
    // User authentication (demo - for frontend only)
    static async login(email, password) {
        try {
            console.log('🔐 Login attempt:', email);
            
            // Demo authentication - replace with real backend auth later
            let role = 'user';
            let name = email.split('@')[0];
            
            if (email === 'admin@support.com' && password === 'password') {
                role = 'admin';
                name = 'Admin User';
            } else if (email === 'agent@support.com' && password === 'password') {
                role = 'agent';
                name = 'Support Agent';
            } else if (email.includes('admin')) {
                role = 'admin';
                name = 'Admin ' + name;
            }
            
            const user = {
                id: Date.now(),
                name: name,
                email: email,
                role: role
            };
            
            console.log('✅ Login successful:', user);
            return user;
        } catch (error) {
            console.error('❌ Login error:', error);
            throw new Error('Invalid email or password');
        }
    }

    static async register(name, email, password) {
        try {
            console.log('📝 Registration attempt:', name, email);
            
            // Demo registration
            const user = {
                id: Date.now(),
                name: name,
                email: email,
                role: 'user'
            };
            
            console.log('✅ Registration successful:', user);
            return user;
        } catch (error) {
            console.error('❌ Registration error:', error);
            throw new Error('Registration failed');
        }
    }

    // REAL TICKET OPERATIONS WITH BACKEND API

    // Create a new ticket
    static async createTicket(ticketData) {
        try {
            console.log('📝 Creating ticket via API:', ticketData);
            
            const response = await fetch(`${API_BASE_URL}/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData)
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

    // Get all tickets
    static async getTickets() {
        try {
            console.log('📋 Fetching tickets via API...');
            
            const response = await fetch(`${API_BASE_URL}/tickets`);
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

    // Update ticket
    static async updateTicket(id, ticketData) {
        try {
            console.log('✏️ Updating ticket via API:', id, ticketData);
            
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData)
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

    // Delete ticket
    static async deleteTicket(id) {
        try {
            console.log('🗑️ Deleting ticket via API:', id);
            
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'DELETE'
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

    // Initialize sample data
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
}

// Global instance
const ticketAPI = {
    login: (email, password) => TicketAPI.login(email, password),
    register: (name, email, password) => TicketAPI.register(name, email, password),
    createTicket: (ticketData) => TicketAPI.createTicket(ticketData),
    getTickets: () => TicketAPI.getTickets(),
    getTicket: (id) => TicketAPI.getTicket(id),
    updateTicket: (id, ticketData) => TicketAPI.updateTicket(id, ticketData),
    deleteTicket: (id) => TicketAPI.deleteTicket(id),
    healthCheck: () => TicketAPI.healthCheck(),
    initSampleData: () => TicketAPI.initSampleData()
};

// Make available globally
window.TicketAPI = TicketAPI;
window.ticketAPI = ticketAPI;