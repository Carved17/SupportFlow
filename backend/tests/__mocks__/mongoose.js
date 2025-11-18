// Mock mongoose for testing
const mongoose = {
  connect: jest.fn().mockResolvedValue({}),
  disconnect: jest.fn().mockResolvedValue({}),
  connection: {
    collections: {},
    readyState: 1
  },
  Schema: jest.fn(),
  model: jest.fn().mockReturnValue(function() {
    return {
      save: jest.fn().mockResolvedValue({
        _id: 'mock-id-123',
        title: 'Mock Ticket',
        description: 'Mock Description',
        customerEmail: 'mock@example.com',
        status: 'Open',
        priority: 'Medium'
      }),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      }),
      findById: jest.fn().mockResolvedValue(null),
      findByIdAndUpdate: jest.fn().mockResolvedValue({
        _id: 'mock-id-123',
        title: 'Updated Ticket',
        status: 'In Progress'
      }),
      findByIdAndDelete: jest.fn().mockResolvedValue({})
    };
  }),
  Types: {
    ObjectId: jest.fn().mockReturnValue('507f1f77bcf86cd799439011')
  }
};

module.exports = mongoose;