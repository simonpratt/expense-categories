import { describe, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import sinon from 'sinon';
import { z } from 'zod';

import { jsonHelpers } from '../../src/helpers/jsonHelpers';

const MockSchema = z.object({
  id: z.number(),
  name: z.string(),
});

describe('extractAndYieldObjects', async () => {
  let parseJsonBufferStub;

  beforeEach(() => {
    parseJsonBufferStub = sinon.stub(jsonHelpers, 'parseJsonBuffer');
  });

  afterEach(() => {
    sinon.restore();
  });

  test('should yield objects from a single chunk', async () => {
    const mockStream = [{ type: 'content_block_delta', delta: { text: '[{"id":1,"name":"Test"}]' } }];
    const mockParseResult = {
      remainingBuffer: '',
      objects: [{ id: 1, name: 'Test' }],
    };
    parseJsonBufferStub.returns(mockParseResult);

    const generator = jsonHelpers.extractAndYieldObjects(mockStream, MockSchema);
    const result = await generator.next();

    assert.deepStrictEqual(result.value, { id: 1, name: 'Test' });
    assert.strictEqual(result.done, false);

    const endResult = await generator.next();
    assert.strictEqual(endResult.done, true);
  });

  test('should handle multiple chunks and yield multiple objects', async () => {
    const mockStream = [
      { type: 'content_block_delta', delta: { text: '[{"id":1,"name":"Test1"},' } },
      { type: 'content_block_delta', delta: { text: '{"id":2,"name":"Test2"}]' } },
    ];
    const mockParseResults = [
      { remainingBuffer: '{"id":2,"name":"Test2"}]', objects: [{ id: 1, name: 'Test1' }] },
      { remainingBuffer: '', objects: [{ id: 2, name: 'Test2' }] },
    ];
    parseJsonBufferStub.onFirstCall().returns(mockParseResults[0]).onSecondCall().returns(mockParseResults[1]);

    const generator = jsonHelpers.extractAndYieldObjects(mockStream, MockSchema);

    let result = await generator.next();
    assert.deepStrictEqual(result.value, { id: 1, name: 'Test1' });
    assert.strictEqual(result.done, false);

    result = await generator.next();
    assert.deepStrictEqual(result.value, { id: 2, name: 'Test2' });
    assert.strictEqual(result.done, false);

    result = await generator.next();
    assert.strictEqual(result.done, true);
  });

  test('should handle empty chunks', async () => {
    const mockStream = [
      { type: 'content_block_delta', delta: { text: '' } },
      { type: 'content_block_delta', delta: { text: '[{"id":1,"name":"Test"}]' } },
    ];
    const mockParseResults = [
      { remainingBuffer: '', objects: [] },
      { remainingBuffer: '', objects: [{ id: 1, name: 'Test' }] },
    ];
    parseJsonBufferStub.onFirstCall().returns(mockParseResults[0]).onSecondCall().returns(mockParseResults[1]);

    const generator = jsonHelpers.extractAndYieldObjects(mockStream, MockSchema);

    const result = await generator.next();
    assert.deepStrictEqual(result.value, { id: 1, name: 'Test' });
    assert.strictEqual(result.done, false);

    const endResult = await generator.next();
    assert.strictEqual(endResult.done, true);
  });

  test('should handle incomplete JSON and yield objects when completed', async () => {
    const mockStream = [
      { type: 'content_block_delta', delta: { text: '[{"id":1,"name":"Test1"},' } },
      { type: 'content_block_delta', delta: { text: '{"id":2,' } },
      { type: 'content_block_delta', delta: { text: '"name":"Test2"}]' } },
    ];
    const mockParseResults = [
      { remainingBuffer: '{"id":2,', objects: [{ id: 1, name: 'Test1' }] },
      { remainingBuffer: '{"id":2,"name":"Test2"}]', objects: [] },
      { remainingBuffer: '', objects: [{ id: 2, name: 'Test2' }] },
    ];
    parseJsonBufferStub
      .onFirstCall()
      .returns(mockParseResults[0])
      .onSecondCall()
      .returns(mockParseResults[1])
      .onThirdCall()
      .returns(mockParseResults[2]);

    const generator = jsonHelpers.extractAndYieldObjects(mockStream, MockSchema);

    let result = await generator.next();
    assert.deepStrictEqual(result.value, { id: 1, name: 'Test1' });
    assert.strictEqual(result.done, false);

    result = await generator.next();
    assert.deepStrictEqual(result.value, { id: 2, name: 'Test2' });
    assert.strictEqual(result.done, false);

    result = await generator.next();
    assert.strictEqual(result.done, true);
  });

  test('should handle non-content_block_delta chunks', async () => {
    const mockStream = [
      { type: 'other_type' },
      { type: 'content_block_delta', delta: { text: '[{"id":1,"name":"Test"}]' } },
    ];
    const mockParseResult = {
      remainingBuffer: '',
      objects: [{ id: 1, name: 'Test' }],
    };
    parseJsonBufferStub.returns(mockParseResult);

    const generator = jsonHelpers.extractAndYieldObjects(mockStream, MockSchema);

    const result = await generator.next();
    assert.deepStrictEqual(result.value, { id: 1, name: 'Test' });
    assert.strictEqual(result.done, false);

    const endResult = await generator.next();
    assert.strictEqual(endResult.done, true);
  });
});

describe('extractAndYieldObjects (without stub)', async () => {
  test('should handle incomplete JSON and yield objects when completed', async () => {
    const mockStream = [
      { type: 'content_block_delta', delta: { text: '[{"id":1,"name":"Test1"},' } },
      { type: 'content_block_delta', delta: { text: '{"id":2,' } },
      { type: 'content_block_delta', delta: { text: '"name":"Test2"}]' } },
    ];

    const generator = jsonHelpers.extractAndYieldObjects(mockStream, MockSchema);

    let result = await generator.next();
    assert.deepStrictEqual(result.value, { id: 1, name: 'Test1' });
    assert.strictEqual(result.done, false);

    result = await generator.next();
    assert.deepStrictEqual(result.value, { id: 2, name: 'Test2' });
    assert.strictEqual(result.done, false);

    result = await generator.next();
    assert.strictEqual(result.done, true);
  });
});
