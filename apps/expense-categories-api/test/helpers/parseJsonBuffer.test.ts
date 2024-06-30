import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { z } from 'zod';

import { jsonHelpers } from '../../src/helpers/jsonHelpers';

// Define a sample schema for testing
const TestSchema = z.object({
  id: z.number(),
  name: z.string(),
});

describe('parseJsonBuffer', async () => {
  // Happy path tests
  test('should parse a complete valid JSON array', () => {
    const buffer = '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]';
    const result = jsonHelpers.parseJsonBuffer(buffer, TestSchema);
    assert.strictEqual(result.remainingBuffer, '[]');
    assert.deepStrictEqual(result.objects, [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  });

  test('should parse a partial valid JSON array and return remaining buffer', () => {
    const buffer = '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"},{"id":3,"name":"Charlie"}';
    const result = jsonHelpers.parseJsonBuffer(buffer, TestSchema);
    assert.strictEqual(result.remainingBuffer, '[');
    assert.deepStrictEqual(result.objects, [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]);
  });

  test('should parse a valid JSON array with a partial object on the end and return remaining buffer', () => {
    const buffer = '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"},{"id":3,"nam';
    const result = jsonHelpers.parseJsonBuffer(buffer, TestSchema);
    assert.strictEqual(result.remainingBuffer, '[{"id":3,"nam');
    assert.deepStrictEqual(result.objects, [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  });

  test('should handle empty array', () => {
    const buffer = '[]';
    const result = jsonHelpers.parseJsonBuffer(buffer, TestSchema);
    assert.strictEqual(result.remainingBuffer, '[]');
    assert.deepStrictEqual(result.objects, []);
  });

  test('should handle array with invalid items', () => {
    const buffer = '[{"id":1,"name":"Alice"},{"id":"invalid","name":"Bob"},{"id":3,"name":"Charlie"}]';
    const result = jsonHelpers.parseJsonBuffer(buffer, TestSchema);
    assert.strictEqual(result.remainingBuffer, '[]');
    assert.deepStrictEqual(result.objects, [
      { id: 1, name: 'Alice' },
      { id: 3, name: 'Charlie' },
    ]);
  });

  // // Error case tests
  test('should return empty result for buffer without opening bracket', () => {
    const buffer = 'invalid json';
    const result = jsonHelpers.parseJsonBuffer(buffer, TestSchema);
    assert.strictEqual(result.remainingBuffer, 'invalid json');
    assert.deepStrictEqual(result.objects, []);
  });

  test('should handle malformed JSON and extract any valid objects before the error', () => {
    const buffer = '[{"id":1,"name":"Alice"},{id:2,"name":"Bob"},{"id":3,"name":"Charlie"}]';
    const result = jsonHelpers.parseJsonBuffer(buffer, TestSchema);
    assert.strictEqual(result.remainingBuffer, '[{id:2,"name":"Bob"},{"id":3,"name":"Charlie"}]');
    assert.deepStrictEqual(result.objects, [{ id: 1, name: 'Alice' }]);
  });

  test('should handle buffer with only opening bracket', () => {
    const buffer = '[';
    const result = jsonHelpers.parseJsonBuffer(buffer, TestSchema);
    assert.strictEqual(result.remainingBuffer, '[');
    assert.deepStrictEqual(result.objects, []);
  });

  test('should handle buffer with nested objects', () => {
    const NestedSchema = z.object({
      id: z.number(),
      name: z.string(),
      nested: z
        .object({
          key: z.string(),
        })
        .optional(),
    });

    const buffer = '[{"id":1,"name":"Alice","nested":{"key":"value"}},{"id":2,"name":"Bob"}]';
    const result = jsonHelpers.parseJsonBuffer(buffer, NestedSchema);
    assert.strictEqual(result.remainingBuffer, '[]');
    assert.deepStrictEqual(result.objects, [
      { id: 1, name: 'Alice', nested: { key: 'value' } },
      { id: 2, name: 'Bob' },
    ]);
  });

  test('should handle buffer with array inside object', () => {
    const NestedSchema = z.object({
      id: z.number(),
      name: z.string(),
      arr: z.array(z.number()).optional(),
    });

    const buffer = '[{"id":1,"name":"Alice","arr":[1,2,3]},{"id":2,"name":"Bob"}]';
    const result = jsonHelpers.parseJsonBuffer(buffer, NestedSchema);
    assert.strictEqual(result.remainingBuffer, '[]');
    assert.deepStrictEqual(result.objects, [
      { id: 1, name: 'Alice', arr: [1, 2, 3] },
      { id: 2, name: 'Bob' },
    ]);
  });

  test('should handle buffer with escaped characters', () => {
    const buffer = '[{"id":1,"name":"Alice\\"s"},{"id":2,"name":"Bob"}]';
    const result = jsonHelpers.parseJsonBuffer(buffer, TestSchema);
    assert.strictEqual(result.remainingBuffer, '[]');
    assert.deepStrictEqual(result.objects, [
      { id: 1, name: 'Alice"s' },
      { id: 2, name: 'Bob' },
    ]);
  });
});
