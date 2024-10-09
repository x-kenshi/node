'use strict';

const common = require('../common');
const assert = require('assert');
const { readFile } = require('fs');
const {
  createHook,
  executionAsyncResource,
  AsyncResource,
} = require('async_hooks');

// Ignore any asyncIds created before our hook is active.
let firstSeenAsyncId = -1;
const idResMap = new Map();
const numExpectedCalls = 5;

createHook({
  init: common.mustCallAtLeast(
    (asyncId, type, triggerId, resource) => {
      if (firstSeenAsyncId === -1) {
        firstSeenAsyncId = asyncId;
      }
      assert.strictEqual(idResMap.get(asyncId), undefined);
      idResMap.set(asyncId, resource);
    }, numExpectedCalls),
  before(asyncId) {
    if (asyncId >= firstSeenAsyncId) {
      beforeHook(asyncId);
    }
  },
  after(asyncId) {
    if (asyncId >= firstSeenAsyncId) {
      afterHook(asyncId);
    }
  },
}).enable();

const beforeHook = common.mustCallAtLeast(
  (asyncId) => {
    const res = idResMap.get(asyncId);
    assert.notStrictEqual(res, undefined);
    const execRes = executionAsyncResource();
    assert.strictEqual(execRes, res);
  }, numExpectedCalls);

const afterHook = common.mustCallAtLeast(
  (asyncId) => {
    const res = idResMap.get(asyncId);
    assert.notStrictEqual(res, undefined);
    const execRes = executionAsyncResource();
    assert.strictEqual(execRes, res);
  }, numExpectedCalls);

const res = new AsyncResource('TheResource');
const initRes = idResMap.get(res.asyncId());
assert.strictEqual(initRes, res);
res.runInAsyncScope(common.mustCall(() => {
  const execRes = executionAsyncResource();
  assert.strictEqual(execRes, res);
}));

readFile(__filename, common.mustCall());
