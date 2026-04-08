// style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
// test: Adding missing tests or correcting existing tests

const typeEnum = [
  "feat",
  "fix",
  "chore",
  "docs",
  "style",
  "refactor",
  "test",
  "revert",
];

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [2, "always", "sentence-case"],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "type-enum": [2, "always", typeEnum],
  },
  plugins: [
    {
      rules: {
        "type-enum": ({ type, subject }) => {
          if (typeEnum?.includes(type) && /^\[NEXT-\d+\] /.test(subject)) {
            return [true];
          }

          return [
            false,
            !/^\[NEXT-\d+\] /.test(subject)
              ? `Commit message should start with <type>: '[NEXT-<number>] '.`
              : !typeEnum?.includes(type) &&
                `Type should be 'feat',
          'fix',
          'chore',
          'docs',
          'style',
          'refactor',
          'test',
          'revert',`,
          ];
        },
      },
    },
  ],
};
