module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageDirectory: './coverage',
  collectCoverage: true,
  coverageReporters: ['html', 'json', 'lcov', 'text', 'clover'],
};
