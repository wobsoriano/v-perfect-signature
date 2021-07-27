module.exports = {
  testMatch: [
    "<rootDir>/src/*/__tests__/*.spec.ts"
  ],
  moduleFileExtensions: [
    'js',
    'ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testEnvironment: 'jsdom',
  setupFiles: [
    'jest-canvas-mock'
  ],
  testEnvironmentOptions: {
    resources: 'usable'
  }
}