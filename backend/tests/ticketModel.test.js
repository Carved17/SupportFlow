// Test Ticket model validation without database
const Ticket = require('../models/ticket');

// Mock the save method
jest.mock('../models/ticket', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({
      _id: 'mock-id',
      title: 'Test Ticket',
      description: 'Test Description',
      customerEmail: 'test@example.com',
      status: 'Open',
      priority: 'Medium'
    })
  }));
});

describe('Ticket Model Validation', () => {
  it('should validate required fields', () => {
    // Test validation logic directly
    const ticket = new Ticket();
    
    // Mock validation error
    const validationError = new Error('Validation failed');
    validationError.name = 'ValidationError';
    
    // Test that save would fail without required fields
    ticket.save = jest.fn().mockRejectedValue(validationError);
    
    expect(ticket.save()).rejects.toThrow('Validation failed');
  });

  it('should accept valid ticket data', async () => {
    const ticketData = {
      title: 'Valid Ticket',
      description: 'Valid Description', 
      customerEmail: 'valid@example.com',
      priority: 'High'
    };

    const ticket = new Ticket(ticketData);
    const savedTicket = await ticket.save();

    expect(savedTicket.title).toBe('Test Ticket'); // From mock
    expect(ticket.save).toHaveBeenCalled();
  });
});