// jest.config.js
const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // ✅ TS 그대로 OK
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy"
  },
  testMatch: [
    "<rootDir>/src/tests/**/*.test.ts?(x)",
    "<rootDir>/src/tests/**/*.spec.ts?(x)"
  ]
};

module.exports = createJestConfig(config);
