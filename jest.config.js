/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};
