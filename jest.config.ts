import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],
  moduleNameMapper: {
    // Se você usa alias "@/..."
    "^@/(.*)$": "<rootDir>/src/$1",

    // CSS/SASS modules
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "<rootDir>/src/tests/styleMock.ts",

    // Assets
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|svg)$":
      "<rootDir>/src/tests/fileMock.ts",
  },
};

export default createJestConfig(customJestConfig);
