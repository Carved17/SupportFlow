// frontend/js/ticketAPI.js
const API_BASE_URL = 'http://localhost:5000/api';

class TicketAPI {
    // User authentication
    static async login(email, password) {
        try {
            console.log('Attempting login for:', email);
            
            // For demo purposes - accept any login but set roles based on email
            let role = 'user';
            let name = email.split('@')[0];
            
            if (email === 'admin@support.com' && password === 'password') {
                role = 'admin';
                name = 'Admin User';
            } else if (email === 'agent@support.com' && password === 'password') {
                role = 'agent';
                name = 'Support Agent';
            } else if (email.includes('admin')) {
                // Any email containing "admin" gets admin role for testing
                role = 'admin';
                name = 'Admin ' + name;
            }
            
            const user = {
                id: Date.now(),
                name: name,
                email: email,
                role: role
            };
            
            console.log('Login successful:', user);
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Invalid email or password');
        }
    }

    static async register(name, email, password) {
        try {
            console.log('Registering user:', name, email);
            
            // For demo purposes
            const user = {
                id: Date.now(),
                name: name,
                email: email,
                role: 'user'
            };
            
            console.log('Registration successful:', user);
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error('Registration failed');
        }
    }

    // Ticket operations - USING REAL BACKEND (CHANGED)
    static async createTicket(ticketData) {
        try {
            console.log('Creating ticket with backend:', ticketData);
            
            const response = await fetch(`${API_BASE_URL}/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create ticket: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            console.log('Ticket created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    }

    static async getTickets() {
        try {
            console.log('Fetching tickets from backend...');
            const response = await fetch(`${API_BASE_URL}/tickets`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch tickets: ${response.statusText}`);
            }

            const tickets = await response.json();
            console.log('Tickets fetched from backend:', tickets.length);
            return tickets;
        } catch (error) {
            console.error('Error fetching tickets:', error);
            // Return empty array if backend is not available
            return [];
        }
    }

    static async getTicket(id) {
        try {
            console.log('Fetching ticket:', id);
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ticket: ${response.statusText}`);
            }

            const ticket = await response.json();
            console.log('Ticket fetched:', ticket);
            return ticket;
        } catch (error) {
            console.error('Error fetching ticket:', error);
            throw error;
        }
    }

    static async updateTicket(id, ticketData) {
        try {
            console.log('Updating ticket:', id, ticketData);
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData)
            });

            if (!response.ok) {
                throw new Error(`Failed to update ticket: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Ticket updated successfully:', result);
            return result;
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    }

    static async deleteTicket(id) {
        try {
            console.log('Deleting ticket:', id);
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete ticket: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Ticket deleted successfully:', result);
            return result;
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    }
}

// Create global instance for backward compatibility
const ticketAPI = {
    login: (email, password) => TicketAPI.login(email, password),
    register: (name, email, password) => TicketAPI.register(name, email, password),
    createTicket: (ticketData) => TicketAPI.createTicket(ticketData),
    getTickets: () => TicketAPI.getTickets(),
    getTicket: (id) => TicketAPI.getTicket(id),
    updateTicket: (id, ticketData) => TicketAPI.updateTicket(id, ticketData),
    deleteTicket: (id) => TicketAPI.deleteTicket(id)
};

// Make available globally
window.TicketAPI = TicketAPI;
window.ticketAPI = ticketAPI;