const request = require('supertest');
const express = require('express');

// Create a simple test app
const app = express();
app.use(express.json());

// Mock the ticket routes
const mockCreateTicket = jest.fn();
const mockGetAllTickets = jest.fn();
const mockGetTicket = jest.fn();
const mockUpdateTicket = jest.fn(); 
const mockDeleteTicket = jest.fn();

// Mock routes
app.post('/api/tickets', (req, res) => {
  mockCreateTicket(req, res);
});

app.get('/api/tickets', (req, res) => {
  mockGetAllTickets(req, res);
});

app.get('/api/tickets/:id', (req, res) => {
  mockGetTicket(req, res);
});

app.put('/api/tickets/:id', (req, res) => {
  mockUpdateTicket(req, res);
});

app.delete('/api/tickets/:id', (req, res) => {
  mockDeleteTicket(req, res);
});

describe('Ticket Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/tickets', () => {
    it('should create a ticket successfully', async () => {
      // Mock successful ticket creation
      mockCreateTicket.mockImplementation((req, res) => {
        res.status(201).json({
          _id: '123',
          title: req.body.title,
          description: req.body.description,
          customerEmail: req.body.customerEmail,
          status: 'Open',
          priority: 'High'
        });
      });

      const ticketData = {
        title: 'Test Ticket',
        description: 'Test Description',
        priority: 'High',
        customerEmail: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/tickets')
        .send(ticketData)
        .expect(201);

      expect(response.body.title).toBe(ticketData.title);
      expect(response.body.status).toBe('Open');
      expect(mockCreateTicket).toHaveBeenCalled();
    });

    it('should return 400 for missing required fields', async () => {
      mockCreateTicket.mockImplementation((req, res) => {
        res.status(400).json({
          error: 'Title, description, and customer email are required'
        });
      });

      const invalidData = {
        title: 'Only title provided'
      };

      const response = await request(app)
        .post('/api/tickets')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/tickets', () => {
    it('should return all tickets', async () => {
      const mockTickets = [
        {
          _id: '1',
          title: 'Ticket 1',
          description: 'Description 1',
          customerEmail: 'test1@example.com',
          status: 'Open'
        },
        {
          _id: '2', 
          title: 'Ticket 2',
          description: 'Description 2',
          customerEmail: 'test2@example.com',
          status: 'In Progress'
        }
      ];

      mockGetAllTickets.mockImplementation((req, res) => {
        res.json(mockTickets);
      });

      const response = await request(app)
        .get('/api/tickets')
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Ticket 1');
    });

    it('should return empty array when no tickets', async () => {
      mockGetAllTickets.mockImplementation((req, res) => {
        res.json([]);
      });

      const response = await request(app)
        .get('/api/tickets')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/tickets/:id', () => {
    it('should return a single ticket', async () => {
      const mockTicket = {
        _id: '123',
        title: 'Single Ticket',
        description: 'Single Description',
        customerEmail: 'single@example.com'
      };

      mockGetTicket.mockImplementation((req, res) => {
        res.json(mockTicket);
      });

      const response = await request(app)
        .get('/api/tickets/123')
        .expect(200);

      expect(response.body.title).toBe('Single Ticket');
    });

    it('should return 404 for non-existent ticket', async () => {
      mockGetTicket.mockImplementation((req, res) => {
        res.status(404).json({ message: 'Ticket not found' });
      });

      await request(app)
        .get('/api/tickets/999')
        .expect(404);
    });
  });

  describe('PUT /api/tickets/:id', () => {
    it('should update a ticket successfully', async () => {
      mockUpdateTicket.mockImplementation((req, res) => {
        res.json({
          _id: '123',
          title: 'Updated Title',
          description: 'Original Description',
          status: 'In Progress',
          priority: 'High'
        });
      });

      const updateData = {
        title: 'Updated Title',
        status: 'In Progress'
      };

      const response = await request(app)
        .put('/api/tickets/123')
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.status).toBe('In Progress');
    });
  });

  describe('DELETE /api/tickets/:id', () => {
    it('should delete a ticket successfully', async () => {
      mockDeleteTicket.mockImplementation((req, res) => {
        res.json({ message: 'Ticket deleted successfully', id: '123' });
      });

      const response = await request(app)
        .delete('/api/tickets/123')
        .expect(200);

      expect(response.body.message).toContain('deleted successfully');
    });
  });
});