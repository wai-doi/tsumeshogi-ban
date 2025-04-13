/** @type {import('ts-jest').JestConfigWithTsJest} **/

// eslint-disable-next-line import/no-default-export
export default {
  testEnvironment: 'node',
  transform: {
    // eslint-disable-next-line no-useless-escape
    '^.+\.tsx?$': ['ts-jest', {}],
  },
}
