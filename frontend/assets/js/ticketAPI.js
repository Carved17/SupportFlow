// frontend/assets/js/ticketAPI.js
const API_BASE_URL = 'http://localhost:5000/api';

class TicketAPI {
    // User authentication (demo)
    static async login(email, password) {
        try {
            console.log('Logging in:', email);
            
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
            
            console.log('Login successful:', user);
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Invalid email or password');
        }
    }

    static async register(name, email, password) {
        try {
            console.log('Registering:', name, email);
            
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

    // REAL API CALLS with fallback to demo data
    static async createTicket(ticketData) {
        try {
            console.log('Creating ticket with real API:', ticketData);
            
            const response = await fetch(`${API_BASE_URL}/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData)
            });

            if (!response.ok) {
                throw new Error(`Failed to create ticket: ${response.status}`);
            }

            const result = await response.json();
            console.log('Ticket created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating ticket, using demo data:', error);
            // Fallback to demo data
            return this.createDemoTicket(ticketData);
        }
    }

    static async getTickets() {
        try {
            console.log('Fetching tickets from real API...');
            const response = await fetch(`${API_BASE_URL}/tickets`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch tickets: ${response.status}`);
            }

            const tickets = await response.json();
            console.log('Tickets fetched successfully:', tickets.length);
            
            return tickets;
        } catch (error) {
            console.error('Error fetching tickets, using demo data:', error);
            // Fallback to demo data
            return this.getDemoTickets();
        }
    }

    static async getTicket(id) {
        try {
            console.log('Fetching ticket from real API:', id);
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ticket: ${response.status}`);
            }

            const ticket = await response.json();
            console.log('Ticket fetched successfully:', ticket);
            return ticket;
        } catch (error) {
            console.error('Error fetching ticket, using demo data:', error);
            // Fallback to demo data
            const demo = this.getDemoTickets();
            return demo.find(t => t._id === id) || demo[0];
        }
    }

    static async updateTicket(id, ticketData) {
        try {
            console.log('Updating ticket with real API:', id, ticketData);
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData)
            });

            if (!response.ok) {
                throw new Error(`Failed to update ticket: ${response.status}`);
            }

            const result = await response.json();
            console.log('Ticket updated successfully:', result);
            return result;
        } catch (error) {
            console.error('Error updating ticket, using demo update:', error);
            // Fallback to demo update
            return { ...ticketData, _id: id, updatedAt: new Date().toISOString() };
        }
    }

    static async deleteTicket(id) {
        try {
            console.log('Deleting ticket with real API:', id);
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete ticket: ${response.status}`);
            }

            const result = await response.json();
            console.log('Ticket deleted successfully:', result);
            return result;
        } catch (error) {
            console.error('Error deleting ticket, using demo delete:', error);
            // Fallback to demo delete
            return { message: "Ticket deleted (demo)", id: id };
        }
    }

    // Demo data fallback methods
    static createDemoTicket(ticketData) {
        const newTicket = {
            ...ticketData,
            _id: `demo-${Date.now()}`,
            id: `demo-${Date.now()}`,
            status: ticketData.status || 'Open',
            priority: ticketData.priority || 'Medium',
            category: ticketData.category || 'General',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assignedTo: null
        };
        console.log('Ticket created (demo):', newTicket);
        return newTicket;
    }

    static getDemoTickets() {
        console.log('Using demo tickets data');
        return [
            {
                _id: 'demo-1',
                id: 'demo-1',
                title: 'Login issue after update',
                description: 'Unable to login after the latest system update. Getting authentication errors.',
                status: 'Open',
                priority: 'High',
                category: 'Technical',
                customerEmail: 'sarah.j@example.com',
                customerName: 'Sarah Johnson',
                createdAt: '2023-06-15T10:30:00Z',
                updatedAt: '2023-06-15T10:30:00Z',
                assignedTo: 'John Doe'
            },
            {
                _id: 'demo-2',
                id: 'demo-2',
                title: 'Payment gateway not working',
                description: 'Customers reporting payment failures during checkout process.',
                status: 'In Progress',
                priority: 'High',
                category: 'Billing',
                customerEmail: 'mike.t@example.com',
                customerName: 'Mike Thompson',
                createdAt: '2023-06-14T14:20:00Z',
                updatedAt: '2023-06-15T09:15:00Z',
                assignedTo: 'Jane Smith'
            }
        ];
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
    deleteTicket: (id) => TicketAPI.deleteTicket(id)
};

window.TicketAPI = TicketAPI;
window.ticketAPI = ticketAPI;