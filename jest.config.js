const tsPreset = require('ts-jest/jest-preset');
const shelfPreset = require('@shelf/jest-mongodb/jest-preset');
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...tsPreset,
  ...shelfPreset,
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['__tests__/__mocks__', '__tests__/setupAfterEnv.ts'],
  setupFiles: ['./src/__tests__/__mocks__/setupGlobalMocks.ts'],
  setupFilesAfterEnv: ['./src/__tests__/setupAfterEnv.ts'],
};