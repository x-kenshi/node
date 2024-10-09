'use strict';

const common = require('../common');
if ((!common.hasCrypto) || (!common.hasIntl)) {
  common.skip('ESLint tests require crypto and Intl');
}

common.skipIfEslintMissing();

const RuleTester = require('../../tools/eslint/node_modules/eslint').RuleTester;
const rule = require('../../tools/eslint-rules/prefer-assert-methods');

const makeInvalidTest = (code, test) => {
  return [
    { code: `assert(${code})`, ...test },
    { code: `assert.ok(${code})`, ...test },
  ];
};

new RuleTester().run('prefer-assert-methods', rule, {
  valid: [
    'assert.strictEqual(foo, bar);',
    'assert(foo === bar && baz);',
    'assert.notStrictEqual(foo, bar);',
    'assert(foo !== bar && baz);',
    'assert.equal(foo, bar);',
    'assert(foo == bar && baz);',
    'assert.notEqual(foo, bar);',
    'assert(foo != bar && baz);',
    'assert.ok(foo);',
    'assert.ok(foo === bar && baz);',
    'assert.includes(foo, bar);',
  ],
  invalid: [
    ...makeInvalidTest('foo == bar', {
      errors: [{ message: "Use assert.equal instead of '==' in assertions." }],
      output: 'assert.equal(foo, bar);'
    }),
    ...makeInvalidTest('foo === bar', {
      errors: [{ message: "Use assert.strictEqual instead of '===' in assertions." }],
      output: 'assert.strictEqual(foo, bar);'
    }),
    ...makeInvalidTest('foo != bar', {
      errors: [{ message: "Use assert.notEqual instead of '!=' in assertions." }],
      output: 'assert.notEqual(foo, bar);'
    }),
    ...makeInvalidTest('foo !== bar', {
      errors: [{ message: "Use assert.notStrictEqual instead of '!==' in assertions." }],
      output: 'assert.notStrictEqual(foo, bar);'
    }),
    ...makeInvalidTest('foo.includes(bar)', {
      errors: [{ message: 'Use assert.includes instead of assert(foo.includes(bar))' }],
      output: 'assert.includes(foo, bar);'
    }),
    ...makeInvalidTest('foo !== bar, "..."', {
      errors: [{ message: "Use assert.notStrictEqual instead of '!==' in assertions." }],
      output: 'assert.notStrictEqual(foo, bar, "...");'
    }),
    ...makeInvalidTest('foo.includes(bar), "..."', {
      errors: [{ message: 'Use assert.includes instead of assert(foo.includes(bar))' }],
      output: 'assert.includes(foo, bar, "...");'
    }),
  ]
});
