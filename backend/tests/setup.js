// Simple setup without MongoDB Memory Server
beforeAll(async () => {
  // No database connection needed for mocked tests
  console.log('Test setup complete');
}, 10000);

afterAll(async () => {
  console.log('Test teardown complete');
});

afterEach(async () => {
  // Clear any mocks
  jest.clearAllMocks();
});