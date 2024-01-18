import type { JestConfigWithTsJest } from 'ts-jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
} satisfies JestConfigWithTsJest;
