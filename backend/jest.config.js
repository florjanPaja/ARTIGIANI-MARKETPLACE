module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    setupFiles: ['<rootDir>/jest.setup.js'],         
    setupFilesAfterEnv: ['<rootDir>/__tests__/setupTestDb.js'],
    verbose: true,
    forceExit: true,
    clearMocks: true
  };
  