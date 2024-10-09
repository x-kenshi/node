/**
 * @fileoverview Enforces the use of `assert.includes`, `assert.strictEqual`, and other
 * specific assert methods instead of assert operators ( ===, !==, ==, != ).
 */

'use strict';

const assertCallExpressionSelector = [
  'ExpressionStatement[expression.type="CallExpression"][expression.callee.name="assert"]',
  'ExpressionStatement[expression.callee.object.name="assert"][expression.callee.property.name="ok"]',
].join(',');

const operatorToAssertMethodMap = {
  '===': 'strictEqual',
  '!==': 'notStrictEqual',
  '==': 'equal',
  '!=': 'notEqual',
};

module.exports = {
  meta: { fixable: 'code' },
  create(context) {
    const { sourceCode } = context;

    return {
      [assertCallExpressionSelector](node) {
        const firstArg = node.expression.arguments[0];
        const extraArgs = node.expression.arguments.slice(1).map((arg) => sourceCode.getText(arg)).join(', ');

        const appendExtraArgs = extraArgs ? `, ${extraArgs}` : '';

        // Handle binary expression assertions (===, !==, ==, !=)
        if (firstArg.type === 'BinaryExpression') {
          const { operator, left, right } = firstArg;
          const assertMethod = operatorToAssertMethodMap[operator];

          if (assertMethod) {
            context.report({
              node,
              message: `Use assert.${assertMethod} instead of '${operator}' in assertions.`,
              fix: (fixer) => fixer.replaceText(
                node,
                `assert.${assertMethod}(${sourceCode.getText(left)}, ${sourceCode.getText(right)}${appendExtraArgs});`,
              ),
            });
          }
        }

        // Handle assert with `.includes(...)`
        if (firstArg.type === 'CallExpression' && firstArg.callee.property?.name === 'includes') {
          const container = sourceCode.getText(firstArg.callee.object);
          const valueToCheck = sourceCode.getText(firstArg.arguments[0]);

          context.report({
            node,
            message: `Use assert.includes instead of assert(${container}.includes(${valueToCheck}))`,
            fix: (fixer) => fixer.replaceText(
              node,
              `assert.includes(${container}, ${valueToCheck}${appendExtraArgs});`,
            ),
          });
        }
      },
    };
  },
};
